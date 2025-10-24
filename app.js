require('dotenv').config();require('dotenv').config();require('dotenv').config();require('dotenv').config();require('dotenv').config();const express = require('express');

const express = require('express');

const https = require('https');const express = require('express');

const crypto = require('crypto');

const https = require('https');const express = require('express');

const app = express();

app.use(express.json());const crypto = require('crypto');



app.get('/', function(req, res) {const app = express();const axios = require('axios');const express = require('express');

    res.json({

        message: 'Webhook Piperun to Meta Ads',

        status: 'active',

        webhook_url: '/webhook/piperun'app.use(express.json());const crypto = require('crypto');

    });

});



app.post('/webhook/piperun', function(req, res) {app.get('/', function(req, res) {const app = express();const cors = require('cors');const express = require('express');const app = express();

    console.log('Webhook:', JSON.stringify(req.body));

        res.json({

    var email = req.body.email || '';

    var phone = req.body.phone || '';        message: 'Piperun to Meta Ads Webhook',

    

    var userData = {};        status: 'active',

    if (email) userData.em = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');

    if (phone) userData.ph = crypto.createHash('sha256').update(phone.replace(/\D/g, '')).digest('hex');        webhook: '/webhook/piperun'app.use(express.json());const app = express();

    

    var payload = JSON.stringify({    });

        data: [{

            event_name: 'Lead',});

            event_time: Math.floor(Date.now() / 1000),

            action_source: 'website',

            user_data: userData

        }],app.post('/webhook/piperun', function(req, res) {app.get('/', (req, res) => {const cors = require('cors');

        test_event_code: process.env.META_TEST_CODE

    });    console.log('Webhook recebido:', JSON.stringify(req.body));

    

    var options = {        res.json({

        hostname: 'graph.facebook.com',

        path: '/v18.0/' + process.env.META_PIXEL_ID + '/events?access_token=' + process.env.META_ACCESS_TOKEN,    var email = req.body.email || req.body.person_email || '';

        method: 'POST',

        headers: {    var phone = req.body.phone || req.body.person_phone || '';        message: 'Piperun to Meta Ads Webhook',// Middlewares

            'Content-Type': 'application/json',

            'Content-Length': Buffer.byteLength(payload)    var name = req.body.name || req.body.person_name || '';

        }

    };            status: 'active',

    

    var req2 = https.request(options, function(res2) {    var userData = {};

        var data = '';

        res2.on('data', function(d) { data += d; });    if (email) userData.em = crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');        webhook: '/webhook/piperun'app.use(cors());const webhookDiagnostic = require('./src/services/webhookDiagnostic');app.get('/', (req, res) => {

        res2.on('end', function() {

            console.log('Meta:', data);    if (phone) userData.ph = crypto.createHash('sha256').update(phone.replace(/\D/g, '')).digest('hex');

            res.json({ success: true, response: data });

        });    if (name) userData.fn = crypto.createHash('sha256').update(name.toLowerCase().trim()).digest('hex');    });

    });

        

    req2.on('error', function(e) {

        console.error(e);    var eventData = JSON.stringify({});app.use(express.json());

        res.status(500).json({ success: false, error: e.message });

    });        data: [{

    

    req2.write(payload);            event_name: 'Lead',

    req2.end();

});            event_time: Math.floor(Date.now() / 1000),



// FORÇA O SERVIDOR A INICIAR (NÃO DEPENDE DO CPANEL)            action_source: 'website',app.post('/webhook/piperun', (req, res) => {app.use(express.urlencoded({ extended: true }));const metaAdsService = require('./src/services/metaAdsService');    res.send('Minimal App is Running!');

if (typeof PhusionPassenger === 'undefined') {

    var PORT = process.env.PORT || 3000;            user_data: userData

    app.listen(PORT, function() {

        console.log('Server on port ' + PORT);        }],    console.log('Webhook recebido:', req.body);

    });

} else {        test_event_code: process.env.META_TEST_CODE

    console.log('Running on Passenger');

}    });    



module.exports = app;    


    var options = {    const email = req.body.email || req.body.person_email || '';

        hostname: 'graph.facebook.com',

        port: 443,    const phone = req.body.phone || req.body.person_phone || '';// Rota principalconst piperunService = require('./src/services/piperunService');});

        path: '/v18.0/' + process.env.META_PIXEL_ID + '/events?access_token=' + process.env.META_ACCESS_TOKEN,

        method: 'POST',    const name = req.body.name || req.body.person_name || '';

        headers: {

            'Content-Type': 'application/json',    app.get('/', function(req, res) {

            'Content-Length': eventData.length

        }    const userData = {};

    };

        if (email) userData.em = crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');    res.json({const logger = require('./src/utils/logger');

    var metaReq = https.request(options, function(metaRes) {

        var data = '';    if (phone) userData.ph = crypto.createHash('sha256').update(phone.replace(/\D/g, '')).digest('hex');

        

        metaRes.on('data', function(chunk) {    if (name) userData.fn = crypto.createHash('sha256').update(name.toLowerCase().trim()).digest('hex');        message: 'Piperun to Meta Ads Webhook Integration',

            data += chunk;

        });    

        

        metaRes.on('end', function() {    const eventData = {        status: 'active',module.exports = app;

            console.log('Meta response:', data);

            res.json({ success: true, meta_response: JSON.parse(data) });        data: [{

        });

    });            event_name: 'Lead',        version: '1.0.0',const app = express();

    

    metaReq.on('error', function(error) {            event_time: Math.floor(Date.now() / 1000),

        console.error('Erro:', error);

        res.status(500).json({ success: false, error: error.message });            action_source: 'website',        webhook_url: '/webhook/piperun'

    });

                user_data: userData

    metaReq.write(eventData);

    metaReq.end();        }],    });// Middlewares

});

        test_event_code: process.env.META_TEST_CODE

module.exports = app;

    };});app.use(cors());

    

    const url = `https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`;app.use(express.json());

    

    axios.post(url, eventData)// Webhook do Piperunapp.use(express.urlencoded({ extended: true }));

        .then(response => {

            console.log('Sucesso:', response.data);app.post('/webhook/piperun', function(req, res) {

            res.json({ success: true, meta_response: response.data });

        })    const axios = require('axios');// Middleware de logging

        .catch(error => {

            console.error('Erro:', error.response ? error.response.data : error.message);    app.use((req, res, next) => {

            res.status(500).json({ success: false, error: error.message });

        });    console.log('Webhook recebido:', JSON.stringify(req.body));    logger.info(`${req.method} ${req.path} - ${req.ip}`);

});

        next();

module.exports = app;

    // Extrair dados do Piperun});

    const data = req.body;

    const email = data.email || data.person_email || '';// Rotas principais

    const phone = data.phone || data.person_phone || '';app.get('/', (req, res) => {

    const name = data.name || data.person_name || '';    res.json({

            message: 'Piperun → Meta Ads Webhook Integration',

    // Preparar evento para Meta        status: 'active',

    const eventData = {        version: '1.0.0',

        data: [{        endpoints: {

            event_name: 'Lead',            webhook: '/webhook/piperun',

            event_time: Math.floor(Date.now() / 1000),            diagnostic: '/diagnostic',

            action_source: 'website',            test: '/test-connection'

            user_data: {        }

                em: email ? require('crypto').createHash('sha256').update(email.toLowerCase().trim()).digest('hex') : undefined,    });

                ph: phone ? require('crypto').createHash('sha256').update(phone.replace(/\D/g, '')).digest('hex') : undefined,});

                fn: name ? require('crypto').createHash('sha256').update(name.toLowerCase().trim()).digest('hex') : undefined

            }// Rota do webhook principal do Piperun

        }],app.post('/webhook/piperun', async (req, res) => {

        test_event_code: process.env.META_TEST_CODE    try {

    };        logger.info('Webhook recebido do Piperun', { body: req.body });

            

    // Enviar para Meta        // 1. Diagnóstico dos dados recebidos

    const url = 'https://graph.facebook.com/v18.0/' + process.env.META_PIXEL_ID + '/events';        const diagnostic = await webhookDiagnostic.analyzePiperunData(req.body);

            

    axios.post(url, eventData, {        if (!diagnostic.isValid) {

        params: {            logger.error('Dados inválidos recebidos do Piperun', diagnostic.errors);

            access_token: process.env.META_ACCESS_TOKEN            return res.status(400).json({

        }                success: false,

    })                message: 'Dados inválidos',

    .then(function(response) {                errors: diagnostic.errors

        console.log('Sucesso Meta:', response.data);            });

        res.json({        }

            success: true,

            message: 'Evento enviado para Meta Ads',        // 2. Processar e normalizar dados

            meta_response: response.data        const processedData = await piperunService.processWebhookData(req.body);

        });        

    })        // 3. Enviar para Meta Ads

    .catch(function(error) {        const metaResult = await metaAdsService.sendEvent(processedData);

        console.error('Erro Meta:', error.response ? error.response.data : error.message);        

        res.status(500).json({        if (metaResult.success) {

            success: false,            logger.info('Evento enviado com sucesso para Meta Ads', { 

            message: 'Erro ao enviar para Meta Ads',                eventId: metaResult.eventId,

            error: error.response ? error.response.data : error.message                status: metaResult.status 

        });            });

    });            

});            res.json({

                success: true,

module.exports = app;                message: 'Evento processado e enviado para Meta Ads',

                eventId: metaResult.eventId,
                status: metaResult.status
            });
        } else {
            throw new Error(metaResult.error || 'Falha ao enviar evento para Meta Ads');
        }

    } catch (error) {
        logger.error('Erro ao processar webhook do Piperun', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
        });
    }
});

// Rota de diagnóstico
app.get('/diagnostic', async (req, res) => {
    try {
        const diagnostic = await webhookDiagnostic.runCompleteDiagnostic();
        res.json(diagnostic);
    } catch (error) {
        logger.error('Erro no diagnóstico', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao executar diagnóstico',
            error: error.message
        });
    }
});

// Rota de teste de conexão
app.get('/test-connection', async (req, res) => {
    try {
        const metaTest = await metaAdsService.testConnection();
        const piperunTest = await piperunService.testConnection();
        
        res.json({
            metaAds: metaTest,
            piperun: piperunTest,
            overall: metaTest.success && piperunTest.success ? 'success' : 'error'
        });
    } catch (error) {
        logger.error('Erro no teste de conexão', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao testar conexões',
            error: error.message
        });
    }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    logger.error('Erro não tratado', error);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
    });
});

module.exports = app;
