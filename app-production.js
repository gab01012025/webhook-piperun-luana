require('dotenv').config();
const express = require('express');
const https = require('https');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Configuração do ambiente
const IS_PRODUCTION = process.env.NODE_ENV === 'production' && process.env.ENABLE_TEST_MODE !== 'true';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

// Função para fazer log estruturado
function log(level, message, data) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp: timestamp,
        level: level,
        message: message,
        data: data || {}
    };
    console.log(JSON.stringify(logEntry));
}

// Função para hash SHA256
function hashSHA256(value) {
    if (!value) return null;
    return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

// Função para enviar evento ao Meta com retry
function sendToMeta(eventData, retryCount, callback) {
    retryCount = retryCount || 0;
    
    const payloadData = {
        data: [eventData]
    };
    
    // Adicionar test_event_code APENAS se estiver em modo teste
    if (!IS_PRODUCTION && process.env.META_TEST_CODE) {
        payloadData.test_event_code = process.env.META_TEST_CODE;
    }
    
    const payload = JSON.stringify(payloadData);
    
    const options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: `/v18.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };
    
    log('info', 'Enviando evento ao Meta', {
        event_name: eventData.event_name,
        event_source_url: eventData.event_source_url,
        external_id: eventData.user_data.external_id,
        is_production: IS_PRODUCTION,
        retry_count: retryCount,
        has_test_code: !IS_PRODUCTION && !!process.env.META_TEST_CODE
    });
    
    const request = https.request(options, function(response) {
        let data = '';
        
        response.on('data', function(chunk) {
            data += chunk;
        });
        
        response.on('end', function() {
            try {
                const result = JSON.parse(data);
                
                if (response.statusCode === 200 && result.events_received > 0) {
                    log('success', 'meta_event_sent', {
                        event_name: eventData.event_name,
                        external_id: eventData.user_data.external_id,
                        event_source_url: eventData.event_source_url,
                        fbtrace_id: result.fbtrace_id,
                        events_received: result.events_received,
                        status: 'success',
                        fb_diagnostics: result.messages || []
                    });
                    callback(null, result);
                } else {
                    log('error', 'meta_event_error', {
                        event_name: eventData.event_name,
                        external_id: eventData.user_data.external_id,
                        event_source_url: eventData.event_source_url,
                        status_code: response.statusCode,
                        status: 'error',
                        fb_diagnostics: result.messages || [],
                        response: result
                    });
                    
                    // Retry em caso de erro
                    if (retryCount < MAX_RETRIES) {
                        setTimeout(function() {
                            log('info', 'Tentando reenviar evento', { retry: retryCount + 1 });
                            sendToMeta(eventData, retryCount + 1, callback);
                        }, RETRY_DELAY * (retryCount + 1));
                    } else {
                        callback(new Error('Max retries reached'), result);
                    }
                }
            } catch (error) {
                log('error', 'Erro ao processar resposta do Meta', { error: error.message });
                callback(error, null);
            }
        });
    });
    
    request.on('error', function(error) {
        log('error', 'meta_event_error', {
            event_name: eventData.event_name,
            external_id: eventData.user_data.external_id,
            event_source_url: eventData.event_source_url,
            status: 'network_error',
            error: error.message,
            fb_diagnostics: []
        });
        
        // Retry em caso de erro de rede
        if (retryCount < MAX_RETRIES) {
            setTimeout(function() {
                log('info', 'Tentando reenviar evento após erro de rede', { retry: retryCount + 1 });
                sendToMeta(eventData, retryCount + 1, callback);
            }, RETRY_DELAY * (retryCount + 1));
        } else {
            callback(error, null);
        }
    });
    
    request.write(payload);
    request.end();
}

app.get('/', function(req, res) {
    res.json({
        message: 'Webhook Piperun to Meta Ads - Production Ready',
        status: 'active',
        environment: IS_PRODUCTION ? 'production' : 'test',
        webhook_url: '/webhook/piperun',
        version: '2.0.0'
    });
});

app.post('/webhook/piperun', function(req, res) {
    const startTime = Date.now();
    
    log('info', 'Webhook recebido', {
        ip: req.ip || req.connection.remoteAddress,
        user_agent: req.get('user-agent')
    });
    
    // Extrair dados da oportunidade
    var email = req.body.email || req.body.contact_email || '';
    var phone = req.body.telephone || req.body.phone || req.body.cellphone || '';
    var opportunityId = req.body.id || req.body.opportunity_id || '';
    var fbc = req.body.fbc || req.body._fbc || '';
    var fbp = req.body.fbp || req.body._fbp || '';
    
    // Se vier dentro de 'person' ou 'contact'
    if (req.body.person) {
        email = email || req.body.person.email || '';
        phone = phone || req.body.person.telephone || req.body.person.cellphone || req.body.person.phone || '';
    }
    if (req.body.contact) {
        email = email || req.body.contact.email || '';
        phone = phone || req.body.contact.telephone || req.body.contact.cellphone || req.body.contact.phone || '';
    }
    
    // Buscar nos custom_fields
    if (req.body.custom_fields && Array.isArray(req.body.custom_fields)) {
        req.body.custom_fields.forEach(function(field) {
            if (field.name && field.name.toLowerCase().includes('email') && field.value) {
                email = email || field.value;
            }
            if (field.name && (field.name.toLowerCase().includes('telefone') || field.name.toLowerCase().includes('phone')) && field.value) {
                phone = phone || field.value;
            }
            if (field.name && field.name.toLowerCase().includes('fbc') && field.value) {
                fbc = fbc || field.value;
            }
            if (field.name && field.name.toLowerCase().includes('fbp') && field.value) {
                fbp = fbp || field.value;
            }
        });
    }
    
    // Buscar email/telefone recursivamente
    function buscarContato(obj) {
        if (typeof obj === 'object' && obj !== null) {
            for (var key in obj) {
                if (typeof obj[key] === 'string') {
                    if (obj[key].includes('@') && obj[key].includes('.')) {
                        email = email || obj[key];
                    }
                    var numeros = obj[key].replace(/\D/g, '');
                    if (numeros.length >= 10 && numeros.length <= 11) {
                        phone = phone || numeros;
                    }
                } else if (typeof obj[key] === 'object') {
                    buscarContato(obj[key]);
                }
            }
        }
    }
    
    if (!email || !phone) {
        buscarContato(req.body);
    }
    
    // Limpar e validar dados
    email = email ? String(email).trim().toLowerCase() : '';
    phone = phone ? String(phone).replace(/\D/g, '') : '';
    
    // Construir user_data com todos os campos possíveis
    var userData = {
        client_ip_address: req.ip || req.connection.remoteAddress || '',
        client_user_agent: req.get('user-agent') || ''
    };
    
    if (email && email.includes('@')) {
        userData.em = hashSHA256(email);
    }
    if (phone && phone.length >= 10) {
        userData.ph = hashSHA256(phone);
    }
    if (fbc) {
        userData.fbc = fbc;
    }
    if (fbp) {
        userData.fbp = fbp;
    }
    
    // External ID - usar ID da oportunidade
    var externalId = opportunityId || crypto.randomBytes(16).toString('hex');
    userData.external_id = hashSHA256(externalId);
    
    // Validar se tem dados mínimos
    if (!userData.em && !userData.ph) {
        log('error', 'Dados insuficientes para enviar evento', {
            has_email: !!email,
            has_phone: !!phone
        });
        return res.status(400).json({ 
            success: false, 
            error: 'Email ou telefone não encontrados nos dados enviados',
            processing_time_ms: Date.now() - startTime
        });
    }
    
    // Determinar o nome do evento
    var eventName = req.body.event_name || process.env.DEFAULT_EVENT_NAME || 'Reuniao_Agendada';
    
    log('info', 'Dados extraídos', {
        event_name: eventName,
        has_email: !!userData.em,
        has_phone: !!userData.ph,
        has_fbc: !!userData.fbc,
        has_fbp: !!userData.fbp,
        external_id: externalId
    });
    
    // Preparar dados do evento
    var eventData = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: externalId + '_' + eventName + '_' + Date.now(),
        event_source_url: req.body.source_url || 'https://consori.com.br',
        action_source: 'website',
        user_data: userData
    };
    
    // Adicionar valor se for Venda
    if (eventName === 'Venda' && req.body.deal && req.body.deal.value) {
        eventData.custom_data = {
            value: parseFloat(req.body.deal.value) || 0,
            currency: 'BRL',
            content_name: 'Consorcio',
            content_type: 'product'
        };
    }
    
    // Enviar para o Meta com retry
    sendToMeta(eventData, 0, function(error, result) {
        const processingTime = Date.now() - startTime;
        
        if (error) {
            log('error', 'Falha ao enviar evento após todas as tentativas', {
                error: error.message,
                processing_time_ms: processingTime
            });
            return res.status(500).json({
                success: false,
                error: 'Falha ao enviar evento ao Meta Ads',
                processing_time_ms: processingTime
            });
        }
        
        log('success', 'Webhook processado com sucesso', {
            fbtrace_id: result.fbtrace_id,
            processing_time_ms: processingTime
        });
        
        res.json({
            success: true,
            event_name: eventName,
            fbtrace_id: result.fbtrace_id,
            is_production: IS_PRODUCTION,
            processing_time_ms: processingTime
        });
    });
});

// Health check endpoint
app.get('/health', function(req, res) {
    res.json({
        status: 'healthy',
        environment: IS_PRODUCTION ? 'production' : 'test',
        timestamp: new Date().toISOString()
    });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    log('info', 'Servidor iniciado', {
        port: PORT,
        environment: IS_PRODUCTION ? 'production' : 'test',
        node_version: process.version
    });
});

module.exports = app;
