require('dotenv').config();
const axios = require('axios');
const metaAdsService = require('../src/services/metaAdsService');
const piperunService = require('../src/services/piperunService');
const webhookDiagnostic = require('../src/services/webhookDiagnostic');

/**
 * Sistema completo de testes para integração Piperun → Meta Ads
 */
class WebhookTester {
    
    constructor() {
        this.baseUrl = `http://localhost:${process.env.PORT || 3000}`;
        this.testResults = [];
    }

    /**
     * Executa todos os testes
     */
    async runAllTests() {
        console.log('🧪 Iniciando testes da integração Piperun → Meta Ads\n');

        try {
            // 1. Teste de configuração
            await this.testConfiguration();

            // 2. Teste de conectividade
            await this.testConnectivity();

            // 3. Teste de processamento de dados
            await this.testDataProcessing();

            // 4. Teste de envio para Meta Ads
            await this.testMetaAdsIntegration();

            // 5. Teste completo do fluxo
            await this.testCompleteFlow();

            // Relatório final
            this.generateReport();

        } catch (error) {
            console.error('❌ Erro durante execução dos testes:', error.message);
        }
    }

    /**
     * Teste 1: Verificação de configuração
     */
    async testConfiguration() {
        console.log('📋 Teste 1: Verificação de Configuração');
        
        const configTest = {
            name: 'Configuração',
            status: 'running',
            details: {}
        };

        try {
            // Verificar variáveis de ambiente
            const requiredEnvs = ['META_PIXEL_ID', 'META_ACCESS_TOKEN', 'PIPERUN_WEBHOOK_URL'];
            const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

            if (missingEnvs.length > 0) {
                configTest.status = 'failed';
                configTest.error = `Variáveis de ambiente faltando: ${missingEnvs.join(', ')}`;
            } else {
                configTest.status = 'passed';
                configTest.details = {
                    metaPixelId: '✓ Configurado',
                    metaAccessToken: '✓ Configurado',
                    piperunWebhookUrl: '✓ Configurado'
                };
            }

            this.logTestResult('Configuração', configTest.status, configTest);

        } catch (error) {
            configTest.status = 'failed';
            configTest.error = error.message;
            this.logTestResult('Configuração', 'failed', configTest);
        }

        this.testResults.push(configTest);
    }

    /**
     * Teste 2: Conectividade
     */
    async testConnectivity() {
        console.log('\n🌐 Teste 2: Conectividade');

        const connectivityTest = {
            name: 'Conectividade',
            status: 'running',
            details: {}
        };

        try {
            // Testar Meta Ads
            const metaTest = await metaAdsService.testConnection();
            connectivityTest.details.metaAds = metaTest;

            // Testar Piperun
            const piperunTest = await piperunService.testConnection();
            connectivityTest.details.piperun = piperunTest;

            // Testar servidor local
            const serverTest = await this.testLocalServer();
            connectivityTest.details.localServer = serverTest;

            const allConnected = metaTest.success && piperunTest.success && serverTest.success;
            connectivityTest.status = allConnected ? 'passed' : 'failed';

            this.logTestResult('Conectividade', connectivityTest.status, connectivityTest.details);

        } catch (error) {
            connectivityTest.status = 'failed';
            connectivityTest.error = error.message;
            this.logTestResult('Conectividade', 'failed', connectivityTest);
        }

        this.testResults.push(connectivityTest);
    }

    /**
     * Teste 3: Processamento de dados
     */
    async testDataProcessing() {
        console.log('\n🔄 Teste 3: Processamento de Dados');

        const processingTest = {
            name: 'Processamento',
            status: 'running',
            details: {}
        };

        try {
            // Dados de teste simulando webhook do Piperun
            const testData = {
                name: 'João Silva',
                email: 'joao.silva@example.com',
                phone: '(11) 99999-9999',
                status: 'qualified',
                value: 500,
                created_at: new Date().toISOString()
            };

            // Testar processamento
            const processedData = await piperunService.processWebhookData(testData);

            // Verificar se dados foram processados corretamente
            const validations = {
                hasEventName: !!processedData.event_name,
                hasUserData: !!processedData.user_data && Object.keys(processedData.user_data).length > 0,
                hasEmail: !!processedData.user_data.email,
                hasTimestamp: !!processedData.timestamp,
                hasCustomData: !!processedData.custom_data
            };

            const allValid = Object.values(validations).every(v => v);
            processingTest.status = allValid ? 'passed' : 'failed';
            processingTest.details = {
                input: testData,
                output: processedData,
                validations
            };

            this.logTestResult('Processamento de Dados', processingTest.status, validations);

        } catch (error) {
            processingTest.status = 'failed';
            processingTest.error = error.message;
            this.logTestResult('Processamento de Dados', 'failed', processingTest);
        }

        this.testResults.push(processingTest);
    }

    /**
     * Teste 4: Integração Meta Ads
     */
    async testMetaAdsIntegration() {
        console.log('\n📊 Teste 4: Integração Meta Ads');

        const metaTest = {
            name: 'Meta Ads Integration',
            status: 'running',
            details: {}
        };

        try {
            // Enviar evento de teste
            const testResult = await metaAdsService.sendTestEvent({
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                value: 100
            });

            metaTest.details = testResult;
            metaTest.status = testResult.success ? 'passed' : 'failed';

            if (testResult.success) {
                console.log('✅ Evento enviado com sucesso para Meta Ads');
                console.log(`📋 Event ID: ${testResult.eventId}`);
                console.log(`📊 Events Received: ${testResult.eventsReceived}`);
                console.log(`🧪 Test Mode: ${testResult.isTest ? 'Sim' : 'Não'}`);
            } else {
                console.log('❌ Falha ao enviar evento para Meta Ads');
                console.log(`❗ Erro: ${testResult.error}`);
            }

        } catch (error) {
            metaTest.status = 'failed';
            metaTest.error = error.message;
            this.logTestResult('Meta Ads Integration', 'failed', metaTest);
        }

        this.testResults.push(metaTest);
    }

    /**
     * Teste 5: Fluxo completo
     */
    async testCompleteFlow() {
        console.log('\n🔄 Teste 5: Fluxo Completo (Webhook → Meta Ads)');

        const flowTest = {
            name: 'Complete Flow',
            status: 'running',
            details: {}
        };

        try {
            // Simular webhook do Piperun
            const webhookData = {
                person: {
                    name: 'Maria Santos',
                    email: 'maria.santos@example.com',
                    phone: '11987654321'
                },
                deal: {
                    status: 'qualified',
                    value: 750,
                    currency: 'BRL'
                },
                timestamp: new Date().toISOString()
            };

            // Enviar para o endpoint do webhook
            const response = await axios.post(`${this.baseUrl}/webhook/piperun`, webhookData, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000
            });

            flowTest.details = {
                webhookStatus: response.status,
                response: response.data,
                success: response.data.success
            };

            flowTest.status = response.data.success ? 'passed' : 'failed';

            if (response.data.success) {
                console.log('✅ Fluxo completo executado com sucesso!');
                console.log(`📊 Status: ${response.status}`);
                console.log(`📋 Event ID: ${response.data.eventId}`);
                console.log(`📈 Status Meta: ${response.data.status}`);
            }

        } catch (error) {
            flowTest.status = 'failed';
            flowTest.error = error.message;
            console.log('❌ Falha no fluxo completo:', error.message);
        }

        this.testResults.push(flowTest);
    }

    /**
     * Testa servidor local
     */
    async testLocalServer() {
        try {
            const response = await axios.get(`${this.baseUrl}/`, { timeout: 5000 });
            return {
                success: true,
                status: response.status,
                message: 'Servidor local respondendo'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Log resultado do teste
     */
    logTestResult(testName, status, details) {
        const statusIcon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '🔄';
        console.log(`${statusIcon} ${testName}: ${status.toUpperCase()}`);
        
        if (details && typeof details === 'object') {
            console.log(JSON.stringify(details, null, 2));
        }
    }

    /**
     * Gera relatório final
     */
    generateReport() {
        console.log('\n📊 RELATÓRIO FINAL DOS TESTES');
        console.log('=====================================\n');

        const passed = this.testResults.filter(t => t.status === 'passed').length;
        const failed = this.testResults.filter(t => t.status === 'failed').length;
        const total = this.testResults.length;

        console.log(`✅ Testes Aprovados: ${passed}/${total}`);
        console.log(`❌ Testes Falharam: ${failed}/${total}`);
        console.log(`📈 Taxa de Sucesso: ${Math.round((passed/total) * 100)}%\n`);

        // Detalhes dos testes falhados
        const failedTests = this.testResults.filter(t => t.status === 'failed');
        if (failedTests.length > 0) {
            console.log('❌ TESTES QUE FALHARAM:');
            failedTests.forEach(test => {
                console.log(`- ${test.name}: ${test.error || 'Erro desconhecido'}`);
            });
            console.log('');
        }

        // Próximos passos
        console.log('📋 PRÓXIMOS PASSOS:');
        if (failed === 0) {
            console.log('✅ Todos os testes passaram! A integração está funcionando corretamente.');
            console.log('🎯 Você pode agora configurar o webhook real no Piperun.');
        } else {
            console.log('🔧 Corrija os problemas identificados nos testes que falharam.');
            console.log('📚 Consulte a documentação no README.md para mais detalhes.');
        }

        console.log('\n🔗 LINKS ÚTEIS:');
        console.log('- Webhook Endpoint:', `${this.baseUrl}/webhook/piperun`);
        console.log('- Diagnóstico:', `${this.baseUrl}/diagnostic`);
        console.log('- Teste de Conexão:', `${this.baseUrl}/test-connection`);
    }

    /**
     * Executa teste de diagnóstico
     */
    async runDiagnostic() {
        console.log('🔍 Executando diagnóstico completo...\n');
        
        try {
            const diagnostic = await webhookDiagnostic.runCompleteDiagnostic();
            console.log('📊 RESULTADO DO DIAGNÓSTICO:');
            console.log(JSON.stringify(diagnostic, null, 2));
        } catch (error) {
            console.error('❌ Erro no diagnóstico:', error.message);
        }
    }
}

// Executar testes se rodado diretamente
if (require.main === module) {
    const tester = new WebhookTester();
    
    // Verificar argumentos da linha de comando
    const args = process.argv.slice(2);
    
    if (args.includes('--diagnostic')) {
        tester.runDiagnostic();
    } else {
        // Aguardar um pouco para o servidor iniciar se necessário
        setTimeout(() => {
            tester.runAllTests();
        }, 2000);
    }
}

module.exports = WebhookTester;