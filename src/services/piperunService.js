const axios = require('axios');
const logger = require('../utils/logger');

class PiperunService {
    
    constructor() {
        this.webhookUrl = process.env.PIPERUN_WEBHOOK_URL;
        this.apiToken = process.env.PIPERUN_API_TOKEN;
    }

    /**
     * Processa dados recebidos do webhook do Piperun
     */
    async processWebhookData(rawData) {
        try {
            logger.info('Processando dados do Piperun', { dataKeys: Object.keys(rawData) });

            // Normalizar estrutura dos dados
            const normalizedData = this.normalizeDataStructure(rawData);
            
            // Extrair informações do usuário
            const userData = this.extractUserData(normalizedData);
            
            // Determinar tipo de evento
            const eventName = this.determineEventType(normalizedData);
            
            // Adicionar metadados
            const processedData = {
                event_name: eventName,
                timestamp: this.extractTimestamp(normalizedData),
                user_data: userData,
                custom_data: this.extractCustomData(normalizedData),
                source_url: this.extractSourceUrl(normalizedData),
                client_ip_address: this.extractClientIP(normalizedData),
                client_user_agent: this.extractUserAgent(normalizedData)
            };

            logger.info('Dados processados com sucesso', {
                eventName: processedData.event_name,
                hasUserData: Object.keys(processedData.user_data).length > 0
            });

            return processedData;

        } catch (error) {
            logger.error('Erro ao processar dados do Piperun', error);
            throw error;
        }
    }

    /**
     * Normaliza estrutura dos dados para formato padrão
     */
    normalizeDataStructure(data) {
        // Se os dados já estão em formato normalizado
        if (data.person || data.contact || data.deal) {
            return data;
        }

        // Tentar identificar e normalizar estruturas comuns do Piperun
        const normalized = {};

        // Procurar por dados da pessoa
        const personFields = ['name', 'nome', 'first_name', 'last_name', 'person'];
        const contactFields = ['email', 'phone', 'telefone', 'celular'];
        const dealFields = ['deal', 'negocio', 'opportunity', 'oportunidade'];

        // Extrair informações da pessoa
        normalized.person = {};
        for (const [key, value] of Object.entries(data)) {
            if (personFields.some(field => key.toLowerCase().includes(field))) {
                normalized.person[key] = value;
            }
        }

        // Extrair informações de contato
        normalized.contact = {};
        for (const [key, value] of Object.entries(data)) {
            if (contactFields.some(field => key.toLowerCase().includes(field))) {
                normalized.contact[key] = value;
            }
        }

        // Extrair informações do negócio
        normalized.deal = {};
        for (const [key, value] of Object.entries(data)) {
            if (dealFields.some(field => key.toLowerCase().includes(field))) {
                normalized.deal[key] = value;
            }
        }

        // Manter campos não categorizados
        normalized.other = {};
        for (const [key, value] of Object.entries(data)) {
            const isPersonField = personFields.some(field => key.toLowerCase().includes(field));
            const isContactField = contactFields.some(field => key.toLowerCase().includes(field));
            const isDealField = dealFields.some(field => key.toLowerCase().includes(field));
            
            if (!isPersonField && !isContactField && !isDealField) {
                normalized.other[key] = value;
            }
        }

        return normalized;
    }

    /**
     * Extrai dados do usuário para o Meta Ads
     */
    extractUserData(data) {
        const userData = {};

        // Buscar email
        const emailFields = ['email', 'email_address', 'contact_email'];
        for (const field of emailFields) {
            const email = this.findFieldValue(data, field);
            if (email && this.isValidEmail(email)) {
                userData.email = email;
                break;
            }
        }

        // Buscar telefone
        const phoneFields = ['phone', 'telefone', 'celular', 'mobile', 'phone_number'];
        for (const field of phoneFields) {
            const phone = this.findFieldValue(data, field);
            if (phone) {
                userData.phone = this.normalizePhone(phone);
                break;
            }
        }

        // Buscar nome
        const nameFields = ['name', 'nome', 'full_name', 'nome_completo'];
        const firstNameFields = ['first_name', 'nome', 'primeiro_nome'];
        const lastNameFields = ['last_name', 'sobrenome', 'ultimo_nome'];

        // Primeiro tentar nome completo
        for (const field of nameFields) {
            const fullName = this.findFieldValue(data, field);
            if (fullName) {
                const nameParts = fullName.split(' ');
                userData.first_name = nameParts[0];
                if (nameParts.length > 1) {
                    userData.last_name = nameParts[nameParts.length - 1];
                }
                break;
            }
        }

        // Se não encontrou nome completo, buscar separado
        if (!userData.first_name) {
            for (const field of firstNameFields) {
                const firstName = this.findFieldValue(data, field);
                if (firstName) {
                    userData.first_name = firstName;
                    break;
                }
            }
        }

        if (!userData.last_name) {
            for (const field of lastNameFields) {
                const lastName = this.findFieldValue(data, field);
                if (lastName) {
                    userData.last_name = lastName;
                    break;
                }
            }
        }

        // Buscar outros campos opcionais
        const cityFields = ['city', 'cidade'];
        const stateFields = ['state', 'estado', 'uf'];
        const countryFields = ['country', 'pais', 'country_code'];
        const zipFields = ['zip', 'cep', 'postal_code'];

        for (const field of cityFields) {
            const city = this.findFieldValue(data, field);
            if (city) {
                userData.city = city;
                break;
            }
        }

        for (const field of stateFields) {
            const state = this.findFieldValue(data, field);
            if (state) {
                userData.state = state;
                break;
            }
        }

        for (const field of countryFields) {
            const country = this.findFieldValue(data, field);
            if (country) {
                userData.country = country;
                break;
            }
        }

        for (const field of zipFields) {
            const zip = this.findFieldValue(data, field);
            if (zip) {
                userData.zip_code = zip;
                break;
            }
        }

        return userData;
    }

    /**
     * Determina o tipo de evento baseado nos dados
     */
    determineEventType(data) {
        // Mapeamento de eventos específicos do funil da Luana
        const eventMappings = {
            'lead': 'Lead',
            'qualified': 'Lead',
            'agendamento': 'Lead',
            'reuniao': 'InitiateCheckout',
            'negociacao': 'InitiateCheckout', 
            'negociação': 'InitiateCheckout',
            'proposta': 'InitiateCheckout',
            'stand-by': 'InitiateCheckout',
            'ganho': 'Purchase',
            'won': 'Purchase',
            'fechado': 'Purchase',
            'no-show': 'Lead', // Manter como Lead para análise
            'perdido': 'Lead',
            'lost': 'Lead'
        };

        // Procurar por indicadores de tipo de evento
        const eventIndicators = ['status', 'stage', 'etapa', 'event', 'evento', 'action'];
        
        for (const indicator of eventIndicators) {
            const value = this.findFieldValue(data, indicator);
            if (value) {
                const lowercaseValue = value.toString().toLowerCase();
                for (const [key, eventType] of Object.entries(eventMappings)) {
                    if (lowercaseValue.includes(key)) {
                        return eventType;
                    }
                }
            }
        }

        // Valor padrão
        return 'Lead';
    }

    /**
     * Extrai timestamp dos dados
     */
    extractTimestamp(data) {
        const timeFields = ['timestamp', 'created_at', 'updated_at', 'data_criacao', 'data_atualizacao', 'date'];
        
        for (const field of timeFields) {
            const timeValue = this.findFieldValue(data, field);
            if (timeValue) {
                const timestamp = new Date(timeValue);
                if (!isNaN(timestamp.getTime())) {
                    return Math.floor(timestamp.getTime() / 1000);
                }
            }
        }

        // Usar timestamp atual se não encontrar
        return Math.floor(Date.now() / 1000);
    }

    /**
     * Extrai dados customizados
     */
    extractCustomData(data) {
        const customData = {};

        // Procurar por valor monetário
        const valueFields = ['value', 'valor', 'amount', 'price', 'preco'];
        for (const field of valueFields) {
            const value = this.findFieldValue(data, field);
            if (value && !isNaN(parseFloat(value))) {
                customData.value = parseFloat(value);
                break;
            }
        }

        // Procurar por moeda
        const currencyFields = ['currency', 'moeda'];
        for (const field of currencyFields) {
            const currency = this.findFieldValue(data, field);
            if (currency) {
                customData.currency = currency;
                break;
            }
        }

        // Se não encontrou moeda, usar BRL como padrão
        if (customData.value && !customData.currency) {
            customData.currency = 'BRL';
        }

        return customData;
    }

    /**
     * Extrai URL de origem
     */
    extractSourceUrl(data) {
        const urlFields = ['source_url', 'url', 'website', 'site'];
        
        for (const field of urlFields) {
            const url = this.findFieldValue(data, field);
            if (url && this.isValidUrl(url)) {
                return url;
            }
        }

        return 'https://piperun.com';
    }

    /**
     * Extrai IP do cliente
     */
    extractClientIP(data) {
        const ipFields = ['client_ip', 'ip', 'client_ip_address', 'user_ip'];
        
        for (const field of ipFields) {
            const ip = this.findFieldValue(data, field);
            if (ip && this.isValidIP(ip)) {
                return ip;
            }
        }

        return null;
    }

    /**
     * Extrai User Agent
     */
    extractUserAgent(data) {
        const uaFields = ['user_agent', 'client_user_agent', 'browser'];
        
        for (const field of uaFields) {
            const ua = this.findFieldValue(data, field);
            if (ua) {
                return ua;
            }
        }

        return null;
    }

    /**
     * Busca valor de campo nos dados (case insensitive)
     */
    findFieldValue(data, fieldName) {
        // Busca direta
        if (data[fieldName]) {
            return data[fieldName];
        }

        // Busca case insensitive
        for (const [key, value] of Object.entries(data)) {
            if (key.toLowerCase() === fieldName.toLowerCase()) {
                return value;
            }
        }

        // Busca em subcampos
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object' && value !== null) {
                const nestedValue = this.findFieldValue(value, fieldName);
                if (nestedValue) {
                    return nestedValue;
                }
            }
        }

        // Busca por inclusão
        for (const [key, value] of Object.entries(data)) {
            if (key.toLowerCase().includes(fieldName.toLowerCase()) || 
                fieldName.toLowerCase().includes(key.toLowerCase())) {
                return value;
            }
        }

        return null;
    }

    /**
     * Valida email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Normaliza telefone
     */
    normalizePhone(phone) {
        // Remove tudo exceto números
        return phone.toString().replace(/[^\d]/g, '');
    }

    /**
     * Valida URL
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Valida IP
     */
    isValidIP(ip) {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        return ipRegex.test(ip);
    }

    /**
     * Testa conexão com Piperun
     */
    async testConnection() {
        try {
            if (!this.webhookUrl) {
                return {
                    success: false,
                    error: 'URL do webhook não configurada'
                };
            }

            // Teste básico de conectividade
            const response = await axios.get(this.webhookUrl, {
                timeout: 10000,
                validateStatus: (status) => status < 500
            });

            return {
                success: true,
                url: this.webhookUrl,
                status: response.status,
                message: 'Webhook endpoint acessível'
            };

        } catch (error) {
            if (error.response?.status === 405) {
                return {
                    success: true,
                    url: this.webhookUrl,
                    status: 405,
                    message: 'Webhook endpoint acessível (Method Not Allowed esperado)'
                };
            }

            return {
                success: false,
                error: error.message,
                url: this.webhookUrl
            };
        }
    }
}

module.exports = new PiperunService();