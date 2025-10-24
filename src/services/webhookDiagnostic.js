const axios = require('axios');
const logger = require('../utils/logger');

class WebhookDiagnostic {
    
    /**
     * Analisa dados recebidos do Piperun
     */
    async analyzePiperunData(data) {
        const diagnostic = {
            isValid: true,
            errors: [],
            warnings: [],
            recommendations: [],
            dataStructure: {}
        };

        try {
            // Verificar se há dados
            if (!data || Object.keys(data).length === 0) {
                diagnostic.isValid = false;
                diagnostic.errors.push('Nenhum dado recebido no webhook');
                return diagnostic;
            }

            // Analisar estrutura dos dados
            diagnostic.dataStructure = this.analyzeDataStructure(data);

            // Verificações essenciais
            await this.checkRequiredFields(data, diagnostic);
            await this.checkDataFormats(data, diagnostic);
            await this.checkTokenValidation(data, diagnostic);

            logger.info('Diagnóstico do webhook concluído', diagnostic);
            return diagnostic;

        } catch (error) {
            logger.error('Erro durante diagnóstico', error);
            diagnostic.isValid = false;
            diagnostic.errors.push(`Erro no diagnóstico: ${error.message}`);
            return diagnostic;
        }
    }

    /**
     * Analisa a estrutura dos dados recebidos
     */
    analyzeDataStructure(data) {
        const structure = {
            hasPersonInfo: false,
            hasContactInfo: false,
            hasEventInfo: false,
            hasTimestamp: false,
            fieldCount: 0,
            fields: []
        };

        if (typeof data === 'object') {
            structure.fields = Object.keys(data);
            structure.fieldCount = structure.fields.length;

            // Verificar campos comuns
            const personFields = ['name', 'nome', 'first_name', 'last_name'];
            const contactFields = ['email', 'phone', 'telefone'];
            const eventFields = ['event', 'evento', 'stage', 'etapa', 'status'];
            const timeFields = ['timestamp', 'created_at', 'data_criacao', 'date'];

            structure.hasPersonInfo = personFields.some(field => 
                structure.fields.some(f => f.toLowerCase().includes(field))
            );

            structure.hasContactInfo = contactFields.some(field => 
                structure.fields.some(f => f.toLowerCase().includes(field))
            );

            structure.hasEventInfo = eventFields.some(field => 
                structure.fields.some(f => f.toLowerCase().includes(field))
            );

            structure.hasTimestamp = timeFields.some(field => 
                structure.fields.some(f => f.toLowerCase().includes(field))
            );
        }

        return structure;
    }

    /**
     * Verifica campos obrigatórios
     */
    async checkRequiredFields(data, diagnostic) {
        const requiredForMeta = ['email']; // Meta Ads requer pelo menos email ou phone
        const recommendedFields = ['name', 'phone', 'event_name'];

        // Verificar campos obrigatórios
        for (const field of requiredForMeta) {
            const hasField = this.findFieldInData(data, field);
            if (!hasField.found) {
                diagnostic.errors.push(`Campo obrigatório não encontrado: ${field}`);
                diagnostic.isValid = false;
            }
        }

        // Verificar campos recomendados
        for (const field of recommendedFields) {
            const hasField = this.findFieldInData(data, field);
            if (!hasField.found) {
                diagnostic.warnings.push(`Campo recomendado não encontrado: ${field}`);
                diagnostic.recommendations.push(`Considere incluir o campo '${field}' para melhor rastreamento`);
            }
        }
    }

    /**
     * Verifica formatos dos dados
     */
    async checkDataFormats(data, diagnostic) {
        // Verificar formato de email
        const emailField = this.findFieldInData(data, 'email');
        if (emailField.found && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                diagnostic.errors.push(`Email em formato inválido: ${emailField.value}`);
                diagnostic.isValid = false;
            }
        }

        // Verificar formato de telefone
        const phoneField = this.findFieldInData(data, ['phone', 'telefone']);
        if (phoneField.found && phoneField.value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
            if (!phoneRegex.test(phoneField.value.toString())) {
                diagnostic.warnings.push(`Telefone pode estar em formato inválido: ${phoneField.value}`);
            }
        }

        // Verificar timestamp
        const timeField = this.findFieldInData(data, ['timestamp', 'created_at', 'data_criacao']);
        if (timeField.found && timeField.value) {
            const timestamp = new Date(timeField.value);
            if (isNaN(timestamp.getTime())) {
                diagnostic.warnings.push(`Timestamp em formato inválido: ${timeField.value}`);
            }
        }
    }

    /**
     * Verifica validação de tokens
     */
    async checkTokenValidation(data, diagnostic) {
        // Verificar se há header de autenticação ou token nos dados
        const hasAuth = process.env.META_ACCESS_TOKEN && process.env.META_PIXEL_ID;
        
        if (!hasAuth) {
            diagnostic.errors.push('Credenciais do Meta Ads não configuradas');
            diagnostic.isValid = false;
            diagnostic.recommendations.push('Configure META_ACCESS_TOKEN e META_PIXEL_ID no arquivo .env');
        }
    }

    /**
     * Executa diagnóstico completo do sistema
     */
    async runCompleteDiagnostic() {
        const diagnostic = {
            timestamp: new Date().toISOString(),
            environment: {
                nodeEnv: process.env.NODE_ENV || 'development',
                port: process.env.PORT || 3000
            },
            configuration: {},
            connectivity: {},
            recommendations: []
        };

        // Verificar configurações
        diagnostic.configuration = {
            metaPixelId: !!process.env.META_PIXEL_ID,
            metaAccessToken: !!process.env.META_ACCESS_TOKEN,
            piperunWebhookUrl: !!process.env.PIPERUN_WEBHOOK_URL,
            hasRequiredConfig: !!(process.env.META_PIXEL_ID && process.env.META_ACCESS_TOKEN)
        };

        // Testar conectividade
        try {
            diagnostic.connectivity.meta = await this.testMetaConnection();
            diagnostic.connectivity.piperun = await this.testPiperunConnection();
        } catch (error) {
            diagnostic.connectivity.error = error.message;
        }

        // Gerar recomendações
        if (!diagnostic.configuration.hasRequiredConfig) {
            diagnostic.recommendations.push('Configure todas as credenciais necessárias no arquivo .env');
        }

        if (!diagnostic.connectivity.meta?.success) {
            diagnostic.recommendations.push('Verifique a conectividade com Meta Ads API');
        }

        return diagnostic;
    }

    /**
     * Testa conexão com Meta Ads
     */
    async testMetaConnection() {
        try {
            if (!process.env.META_ACCESS_TOKEN || !process.env.META_PIXEL_ID) {
                return {
                    success: false,
                    error: 'Credenciais não configuradas'
                };
            }

            const response = await axios.get(
                `https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}`,
                {
                    params: {
                        access_token: process.env.META_ACCESS_TOKEN,
                        fields: 'id,name'
                    },
                    timeout: 10000
                }
            );

            return {
                success: true,
                pixelInfo: response.data,
                status: response.status
            };

        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error?.message || error.message,
                status: error.response?.status
            };
        }
    }

    /**
     * Testa conexão com Piperun
     */
    async testPiperunConnection() {
        try {
            // Teste básico de conectividade com a URL do webhook
            const webhookUrl = process.env.PIPERUN_WEBHOOK_URL;
            
            if (!webhookUrl) {
                return {
                    success: false,
                    error: 'URL do webhook Piperun não configurada'
                };
            }

            // Verificar se a URL é acessível (pode retornar 405 Method Not Allowed, o que é normal)
            const response = await axios.get(webhookUrl, { 
                timeout: 10000,
                validateStatus: (status) => status < 500 // Aceitar códigos de erro do cliente
            });

            return {
                success: true,
                url: webhookUrl,
                status: response.status,
                accessible: true
            };

        } catch (error) {
            if (error.response?.status === 405) {
                // Method Not Allowed é esperado em webhook endpoints
                return {
                    success: true,
                    url: process.env.PIPERUN_WEBHOOK_URL,
                    status: 405,
                    accessible: true,
                    note: 'Endpoint acessível (Method Not Allowed esperado)'
                };
            }

            return {
                success: false,
                error: error.message,
                status: error.response?.status,
                url: process.env.PIPERUN_WEBHOOK_URL
            };
        }
    }

    /**
     * Busca um campo nos dados (case insensitive e variações)
     */
    findFieldInData(data, fieldNames) {
        const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
        
        for (const name of names) {
            for (const [key, value] of Object.entries(data)) {
                if (key.toLowerCase().includes(name.toLowerCase()) || 
                    name.toLowerCase().includes(key.toLowerCase())) {
                    return {
                        found: true,
                        key: key,
                        value: value,
                        fieldName: name
                    };
                }
            }
        }

        return { found: false };
    }
}

module.exports = new WebhookDiagnostic();