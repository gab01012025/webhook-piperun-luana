const axios = require('axios');
const crypto = require('crypto');
const logger = require('../utils/logger');

class MetaAdsService {
    
    constructor() {
        this.pixelId = process.env.META_PIXEL_ID;
        this.accessToken = process.env.META_ACCESS_TOKEN;
        this.testCode = process.env.META_TEST_CODE;
        this.baseURL = 'https://graph.facebook.com/v18.0';
    }

    /**
     * Envia evento para Meta Ads Conversions API
     */
    async sendEvent(eventData) {
        try {
            if (!this.pixelId || !this.accessToken) {
                throw new Error('Credenciais do Meta Ads não configuradas');
            }

            // Preparar dados do evento
            const formattedEvent = this.formatEventForMeta(eventData);
            
            // Preparar payload
            const payload = {
                data: [formattedEvent],
                test_event_code: this.testCode || undefined
            };

            logger.info('Enviando evento para Meta Ads', { 
                pixelId: this.pixelId,
                eventName: formattedEvent.event_name,
                hasTestCode: !!this.testCode
            });

            // Enviar para Meta Ads
            const response = await axios.post(
                `${this.baseURL}/${this.pixelId}/events`,
                payload,
                {
                    params: {
                        access_token: this.accessToken
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            if (response.data.events_received && response.data.events_received > 0) {
                return {
                    success: true,
                    eventId: formattedEvent.event_id,
                    eventsReceived: response.data.events_received,
                    messageId: response.data.messages?.[0]?.message_id,
                    status: 'sent',
                    isTest: !!this.testCode
                };
            } else {
                throw new Error('Meta Ads não confirmou recebimento do evento');
            }

        } catch (error) {
            logger.error('Erro ao enviar evento para Meta Ads', {
                error: error.message,
                response: error.response?.data
            });

            return {
                success: false,
                error: error.response?.data?.error?.message || error.message,
                status: 'failed'
            };
        }
    }

    /**
     * Formata dados do evento para o formato do Meta Ads
     */
    formatEventForMeta(eventData) {
        const now = Math.floor(Date.now() / 1000);
        
        // Gerar ID único para o evento
        const eventId = this.generateEventId(eventData);

        // Dados básicos do evento
        const event = {
            event_name: eventData.event_name || 'Lead',
            event_time: eventData.timestamp || now,
            event_id: eventId,
            action_source: 'website',
            event_source_url: eventData.source_url || 'https://piperun.com',
            user_data: this.formatUserData(eventData.user_data || eventData),
            custom_data: eventData.custom_data || {}
        };

        // Adicionar dados personalizados se existirem
        if (eventData.value) {
            event.custom_data.value = parseFloat(eventData.value);
        }

        if (eventData.currency) {
            event.custom_data.currency = eventData.currency;
        }

        // Adicionar informações de origem se disponíveis
        if (eventData.client_ip_address) {
            event.user_data.client_ip_address = eventData.client_ip_address;
        }

        if (eventData.client_user_agent) {
            event.user_data.client_user_agent = eventData.client_user_agent;
        }

        logger.debug('Evento formatado para Meta Ads', event);
        return event;
    }

    /**
     * Formata dados do usuário para Meta Ads
     */
    formatUserData(userData) {
        const formattedData = {};

        // Email (obrigatório, hash SHA256)
        if (userData.email) {
            formattedData.em = this.hashData(userData.email.toLowerCase().trim());
        }

        // Telefone (hash SHA256, apenas números)
        if (userData.phone) {
            const cleanPhone = userData.phone.toString().replace(/[^\d]/g, '');
            if (cleanPhone.length >= 8) {
                formattedData.ph = this.hashData(cleanPhone);
            }
        }

        // Nome (hash SHA256)
        if (userData.first_name || userData.name) {
            const firstName = userData.first_name || userData.name.split(' ')[0];
            formattedData.fn = this.hashData(firstName.toLowerCase().trim());
        }

        if (userData.last_name) {
            formattedData.ln = this.hashData(userData.last_name.toLowerCase().trim());
        } else if (userData.name && userData.name.includes(' ')) {
            const nameParts = userData.name.split(' ');
            if (nameParts.length > 1) {
                const lastName = nameParts[nameParts.length - 1];
                formattedData.ln = this.hashData(lastName.toLowerCase().trim());
            }
        }

        // Cidade, Estado, País, CEP
        if (userData.city) {
            formattedData.ct = this.hashData(userData.city.toLowerCase().trim());
        }

        if (userData.state) {
            formattedData.st = this.hashData(userData.state.toLowerCase().trim());
        }

        if (userData.country) {
            formattedData.country = this.hashData(userData.country.toLowerCase().trim());
        }

        if (userData.zip_code) {
            formattedData.zp = this.hashData(userData.zip_code.toString().trim());
        }

        // Data de nascimento (formato YYYYMMDD)
        if (userData.date_of_birth) {
            formattedData.db = this.hashData(userData.date_of_birth.toString().trim());
        }

        // Gênero
        if (userData.gender) {
            formattedData.ge = this.hashData(userData.gender.toLowerCase().trim());
        }

        // IP e User Agent (não precisam de hash)
        if (userData.client_ip_address) {
            formattedData.client_ip_address = userData.client_ip_address;
        }

        if (userData.client_user_agent) {
            formattedData.client_user_agent = userData.client_user_agent;
        }

        return formattedData;
    }

    /**
     * Gera hash SHA256 para dados sensíveis
     */
    hashData(data) {
        if (!data) return null;
        return crypto.createHash('sha256').update(data.toString()).digest('hex');
    }

    /**
     * Gera ID único para o evento
     */
    generateEventId(eventData) {
        const baseData = [
            eventData.user_data?.email || eventData.email,
            eventData.timestamp || Date.now(),
            eventData.event_name || 'Lead'
        ].join('|');

        return crypto.createHash('md5').update(baseData).digest('hex');
    }

    /**
     * Testa conexão com Meta Ads API
     */
    async testConnection() {
        try {
            if (!this.pixelId || !this.accessToken) {
                return {
                    success: false,
                    error: 'Credenciais não configuradas'
                };
            }

            // Buscar informações do pixel
            const response = await axios.get(
                `${this.baseURL}/${this.pixelId}`,
                {
                    params: {
                        access_token: this.accessToken,
                        fields: 'id,name,creation_time'
                    },
                    timeout: 15000
                }
            );

            return {
                success: true,
                pixel: response.data,
                message: 'Conexão com Meta Ads estabelecida com sucesso'
            };

        } catch (error) {
            logger.error('Erro ao testar conexão Meta Ads', error);
            return {
                success: false,
                error: error.response?.data?.error?.message || error.message
            };
        }
    }

    /**
     * Envia evento de teste
     */
    async sendTestEvent(customData = {}) {
        const testEventData = {
            event_name: 'Lead',
            timestamp: Math.floor(Date.now() / 1000),
            user_data: {
                email: customData.email || 'test@example.com',
                phone: customData.phone || '11999999999',
                first_name: customData.first_name || 'Test',
                last_name: customData.last_name || 'User'
            },
            custom_data: {
                value: customData.value || 100,
                currency: customData.currency || 'BRL'
            },
            source_url: 'https://test.piperun.com',
            ...customData
        };

        return await this.sendEvent(testEventData);
    }

    /**
     * Verifica eventos no Events Manager
     */
    async getEventStats(startTime, endTime) {
        try {
            const response = await axios.get(
                `${this.baseURL}/${this.pixelId}/stats`,
                {
                    params: {
                        access_token: this.accessToken,
                        start_time: startTime,
                        end_time: endTime
                    },
                    timeout: 15000
                }
            );

            return {
                success: true,
                stats: response.data
            };

        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error?.message || error.message
            };
        }
    }
}

module.exports = new MetaAdsService();