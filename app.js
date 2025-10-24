require('dotenv').config();
const express = require('express');
const https = require('https');
const crypto = require('crypto');

const app = express();
app.use(express.json());

app.get('/', function(req, res) {
    res.json({
        message: 'Webhook Piperun to Meta Ads',
        status: 'active',
        webhook_url: '/webhook/piperun'
    });
});

app.post('/webhook/piperun', function(req, res) {
    console.log('=== WEBHOOK RECEBIDO ===');
    console.log('Dados completos:', JSON.stringify(req.body, null, 2));
    
    // Função auxiliar para buscar valor em múltiplos caminhos
    function findValue(obj, paths) {
        for (var i = 0; i < paths.length; i++) {
            var keys = paths[i].split('.');
            var value = obj;
            var found = true;
            
            for (var j = 0; j < keys.length; j++) {
                if (value && value[keys[j]] !== undefined && value[keys[j]] !== null && value[keys[j]] !== '') {
                    value = value[keys[j]];
                } else {
                    found = false;
                    break;
                }
            }
            
            if (found && value) return value;
        }
        return '';
    }
    
    // Buscar email em vários lugares possíveis
    var emailPaths = [
        'email',
        'contact_email',
        'person.email',
        'contact.email',
        'contact_emails.0',
        'emails.0'
    ];
    
    // Buscar telefone em vários lugares possíveis
    var phonePaths = [
        'telephone',
        'phone',
        'cellphone',
        'person.telephone',
        'person.phone',
        'person.cellphone',
        'contact.telephone',
        'contact.phone',
        'contact.cellphone',
        'contact_phones.0',
        'phones.0'
    ];
    
    var email = findValue(req.body, emailPaths);
    var phone = findValue(req.body, phonePaths);
    
    // Limpar e validar dados
    email = email ? String(email).trim().toLowerCase() : '';
    phone = phone ? String(phone).replace(/\D/g, '') : '';
    
    console.log('Email encontrado:', email || 'NENHUM');
    console.log('Telefone encontrado:', phone || 'NENHUM');
    
    var userData = {};
    if (email && email.includes('@')) {
        userData.em = crypto.createHash('sha256').update(email).digest('hex');
        console.log('Email hash criado:', userData.em);
    }
    if (phone && phone.length >= 10) {
        userData.ph = crypto.createHash('sha256').update(phone).digest('hex');
        console.log('Telefone hash criado:', userData.ph);
    }
    
    // Se não tiver dados suficientes, retornar erro
    if (!userData.em && !userData.ph) {
        console.log('❌ ERRO: Sem email ou telefone válidos');
        console.log('Campos recebidos:', Object.keys(req.body));
        return res.status(400).json({ 
            success: false, 
            error: 'Email ou telefone não encontrados nos dados enviados',
            received_fields: Object.keys(req.body)
        });
    }
    
    var payload = JSON.stringify({
        data: [{
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: userData
        }],
        test_event_code: process.env.META_TEST_CODE
    });
    
    console.log('📤 Enviando para Meta Ads...');
    console.log('Pixel ID:', process.env.META_PIXEL_ID);
    console.log('Test Code:', process.env.META_TEST_CODE || 'NENHUM');
    
    var options = {
        hostname: 'graph.facebook.com',
        path: '/v18.0/' + process.env.META_PIXEL_ID + '/events?access_token=' + process.env.META_ACCESS_TOKEN,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };
    
    var req2 = https.request(options, function(res2) {
        var data = '';
        res2.on('data', function(d) { data += d; });
        res2.on('end', function() {
            console.log('📥 Resposta Meta Ads:', data);
            
            try {
                var response = JSON.parse(data);
                if (response.error) {
                    console.log('❌ ERRO do Meta Ads:', response.error.message);
                    return res.status(400).json({ 
                        success: false, 
                        error: response.error.message,
                        meta_response: response
                    });
                }
                
                if (response.events_received > 0) {
                    console.log('✅ SUCESSO! Eventos recebidos:', response.events_received);
                    return res.json({ 
                        success: true, 
                        events_received: response.events_received,
                        response: response 
                    });
                }
            } catch (e) {
                console.log('⚠️  Resposta não é JSON válido:', data);
            }
            
            res.json({ success: true, response: data });
        });
    });
    
    req2.on('error', function(e) {
        console.error('❌ ERRO na requisição:', e.message);
        res.status(500).json({ success: false, error: e.message });
    });
    
    req2.write(payload);
    req2.end();
});

if (typeof PhusionPassenger === 'undefined') {
    var PORT = process.env.PORT || 3000;
    app.listen(PORT, function() {
        console.log('Server on port ' + PORT);
    });
}

module.exports = app;
