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
    
    var email = req.body.email || '';
    var phone = req.body.phone || '';
    
    var userData = {};
    if (email) userData.em = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
    if (phone) userData.ph = crypto.createHash('sha256').update(phone.replace(/\D/g, '')).digest('hex');
    
    var payload = JSON.stringify({
        data: [{
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: userData
        }],
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
