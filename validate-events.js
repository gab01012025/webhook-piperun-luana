#!/usr/bin/env node

/**
 * Script de Validação de Eventos Meta CAPI
 * 
 * Uso:
 * node validate-events.js [ambiente]
 * 
 * Exemplos:
 * node validate-events.js test
 * node validate-events.js production
 */

require('dotenv').config();
const https = require('https');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://webhook-piperun-luana.onrender.com';
const PIPERUN_TOKEN = process.env.PIPERUN_PRIVATE_TOKEN;

// Cores para output no terminal
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(color, message) {
    console.log(color + message + colors.reset);
}

// Dados de teste
const testEvents = [
    {
        name: 'Reuniao_Agendada',
        payload: {
            event_name: 'Reuniao_Agendada',
            person: {
                email: 'teste.validacao@consori.com.br',
                phone: '11987654321'
            },
            id: 'TEST_' + Date.now(),
            _fbc: 'fb.1.1234567890.AbCdEfGhIjKlMnOpQrStUvWxYz',
            _fbp: 'fb.1.1234567890.1234567890'
        }
    },
    {
        name: 'No_Show',
        payload: {
            event_name: 'No_Show',
            person: {
                email: 'teste.noshow@consori.com.br',
                phone: '11987654322'
            },
            id: 'TEST_' + (Date.now() + 1)
        }
    },
    {
        name: 'Venda',
        payload: {
            event_name: 'Venda',
            person: {
                email: 'teste.venda@consori.com.br',
                phone: '11987654323'
            },
            deal: {
                value: '15000.00'
            },
            id: 'TEST_' + (Date.now() + 2)
        }
    }
];

function sendTestEvent(eventData, callback) {
    const url = new URL(WEBHOOK_URL + '/webhook/piperun');
    const payload = JSON.stringify(eventData.payload);
    
    const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
            'X-PRIVATE-TOKEN': PIPERUN_TOKEN,
            'User-Agent': 'Mozilla/5.0 (Validation Script)'
        }
    };
    
    log(colors.blue, `\n→ Testando evento: ${eventData.name}`);
    console.log('  Payload:', JSON.stringify(eventData.payload, null, 2));
    
    const request = https.request(options, function(response) {
        let data = '';
        
        response.on('data', function(chunk) {
            data += chunk;
        });
        
        response.on('end', function() {
            try {
                const result = JSON.parse(data);
                
                if (response.statusCode === 200 && result.success) {
                    log(colors.green, `✓ ${eventData.name} - Sucesso!`);
                    console.log('  FBTrace ID:', result.fbtrace_id);
                    console.log('  Tempo:', result.processing_time_ms + 'ms');
                    console.log('  Ambiente:', result.is_production ? 'PRODUÇÃO' : 'TESTE');
                    callback(null, result);
                } else {
                    log(colors.red, `✗ ${eventData.name} - Falha!`);
                    console.log('  Status:', response.statusCode);
                    console.log('  Resposta:', JSON.stringify(result, null, 2));
                    callback(new Error('Evento falhou'), result);
                }
            } catch (error) {
                log(colors.red, `✗ ${eventData.name} - Erro ao processar resposta`);
                console.log('  Erro:', error.message);
                console.log('  Resposta bruta:', data);
                callback(error, null);
            }
        });
    });
    
    request.on('error', function(error) {
        log(colors.red, `✗ ${eventData.name} - Erro de conexão`);
        console.log('  Erro:', error.message);
        callback(error, null);
    });
    
    request.write(payload);
    request.end();
}

function runValidation() {
    log(colors.yellow, '='.repeat(60));
    log(colors.yellow, 'VALIDAÇÃO DE EVENTOS META CAPI');
    log(colors.yellow, '='.repeat(60));
    console.log('URL do Webhook:', WEBHOOK_URL);
    console.log('Total de eventos para testar:', testEvents.length);
    
    let successCount = 0;
    let failCount = 0;
    let currentIndex = 0;
    
    function testNext() {
        if (currentIndex >= testEvents.length) {
            // Sumário final
            log(colors.yellow, '\n' + '='.repeat(60));
            log(colors.yellow, 'RESULTADO DA VALIDAÇÃO');
            log(colors.yellow, '='.repeat(60));
            log(colors.green, `Sucessos: ${successCount}`);
            log(colors.red, `Falhas: ${failCount}`);
            
            if (failCount === 0) {
                log(colors.green, '\n✓ TODOS OS EVENTOS FUNCIONARAM CORRETAMENTE!');
                log(colors.blue, '\nPróximos passos:');
                console.log('1. Verifique os eventos no Meta Events Manager');
                console.log('2. Aguarde 5-10 minutos para aparecer');
                console.log('3. Se estiver em TESTE, os eventos terão marcação verde');
                console.log('4. Se estiver em PRODUÇÃO, vão para as métricas reais');
                process.exit(0);
            } else {
                log(colors.red, '\n✗ ALGUNS EVENTOS FALHARAM');
                log(colors.yellow, '\nVerifique:');
                console.log('1. Configurações do .env (tokens, pixel ID)');
                console.log('2. Logs do servidor');
                console.log('3. Permissões da API do Meta');
                process.exit(1);
            }
            return;
        }
        
        sendTestEvent(testEvents[currentIndex], function(error, result) {
            if (error) {
                failCount++;
            } else {
                successCount++;
            }
            
            currentIndex++;
            
            // Aguardar 2 segundos entre eventos
            setTimeout(testNext, 2000);
        });
    }
    
    testNext();
}

// Executar validação
runValidation();
