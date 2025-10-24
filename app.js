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
    console.log('Webhook:', JSON.stringify(req.body));
    
    // Extrair email e telefone dos dados do Piperun
    var email = req.body.email || req.body.contact_email || '';
    var phone = req.body.telephone || req.body.phone || req.body.cellphone || '';
    
    // Se vier dentro de 'person' ou 'contact'
    if (req.body.person) {
        email = email || req.body.person.email || '';
        phone = phone || req.body.person.telephone || req.body.person.cellphone || '';
    }
    if (req.body.contact) {
        email = email || req.body.contact.email || '';
        phone = phone || req.body.contact.telephone || req.body.contact.cellphone || '';
    }
    
    // Limpar e validar dados
    email = email ? String(email).trim().toLowerCase() : '';
    phone = phone ? String(phone).replace(/\D/g, '') : '';
    
    var userData = {};
    if (email && email.includes('@')) {
        userData.em = crypto.createHash('sha256').update(email).digest('hex');
    }
    if (phone && phone.length >= 10) {
        userData.ph = crypto.createHash('sha256').update(phone).digest('hex');
    }
    
    // Se não tiver dados suficientes, retornar erro
    if (!userData.em && !userData.ph) {
        console.log('ERRO: Sem email ou telefone válidos');
        return res.status(400).json({ 
            success: false, 
            error: 'Email ou telefone não encontrados nos dados enviados' 
        });
    }
    
    // Determinar o nome do evento personalizado (vem do Piperun ou usa padrão)
    var eventName = req.body.event_name || process.env.DEFAULT_EVENT_NAME || 'Reuniao_Agendada';
    console.log('Evento:', eventName);
    
    // Preparar dados do evento
    var eventData = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: userData
    };
    
    // Se for Venda, adicionar dados de valor
    if (eventName === 'Venda' && req.body.deal && req.body.deal.value) {
        eventData.custom_data = {
            value: parseFloat(req.body.deal.value) || 0,
            currency: 'BRL'
        };
    }
    
    var payload = JSON.stringify({
        data: [eventData],
        test_event_code: process.env.META_TEST_CODE
    });
    
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
            console.log('Meta:', data);
            res.json({ success: true, response: data });
        });
    });
    
    req2.on('error', function(e) {
        console.error(e);
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
