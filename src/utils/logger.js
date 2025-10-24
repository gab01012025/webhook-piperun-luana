const moment = require('moment');

class Logger {
    constructor() {
        this.logLevel = process.env.LOG_LEVEL || 'info';
        this.enableDebug = process.env.ENABLE_DEBUG === 'true';
    }

    /**
     * Log de informações gerais
     */
    info(message, data = {}) {
        this.log('INFO', message, data);
    }

    /**
     * Log de erros
     */
    error(message, error = null) {
        const errorData = error instanceof Error ? {
            message: error.message,
            stack: error.stack,
            name: error.name
        } : error;

        this.log('ERROR', message, errorData);
    }

    /**
     * Log de avisos
     */
    warn(message, data = {}) {
        this.log('WARN', message, data);
    }

    /**
     * Log de debug (apenas em desenvolvimento)
     */
    debug(message, data = {}) {
        if (this.enableDebug || process.env.NODE_ENV === 'development') {
            this.log('DEBUG', message, data);
        }
    }

    /**
     * Log de sucesso
     */
    success(message, data = {}) {
        this.log('SUCCESS', message, data);
    }

    /**
     * Função principal de log
     */
    log(level, message, data = {}) {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        const logEntry = {
            timestamp,
            level,
            message,
            data: data && Object.keys(data).length > 0 ? data : undefined
        };

        // Console colorido baseado no nível
        const colors = {
            INFO: '\x1b[36m',     // Cyan
            ERROR: '\x1b[31m',    // Red
            WARN: '\x1b[33m',     // Yellow
            DEBUG: '\x1b[90m',    // Gray
            SUCCESS: '\x1b[32m'   // Green
        };

        const reset = '\x1b[0m';
        const color = colors[level] || '';

        console.log(
            `${color}[${timestamp}] ${level}:${reset} ${message}`,
            data && Object.keys(data).length > 0 ? JSON.stringify(data, null, 2) : ''
        );

        // Salvar em arquivo se necessário
        this.saveToFile(logEntry);
    }

    /**
     * Salva log em arquivo
     */
    saveToFile(logEntry) {
        try {
            const fs = require('fs');
            const path = require('path');

            const logsDir = path.join(process.cwd(), 'logs');
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
            }

            const logFile = path.join(logsDir, `app-${moment().format('YYYY-MM-DD')}.log`);
            const logLine = JSON.stringify(logEntry) + '\n';

            fs.appendFileSync(logFile, logLine);
        } catch (error) {
            console.error('Erro ao salvar log em arquivo:', error.message);
        }
    }

    /**
     * Log especial para webhooks
     */
    webhook(direction, url, data, response = null) {
        const webhookLog = {
            direction, // 'incoming' ou 'outgoing'
            url,
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            data: this.sanitizeData(data),
            response: response ? this.sanitizeData(response) : null
        };

        this.info(`Webhook ${direction.toUpperCase()}: ${url}`, webhookLog);
    }

    /**
     * Log especial para eventos do Meta Ads
     */
    metaEvent(eventName, eventId, status, details = {}) {
        const eventLog = {
            eventName,
            eventId,
            status,
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            details
        };

        if (status === 'success') {
            this.success(`Meta Ads Event: ${eventName}`, eventLog);
        } else {
            this.error(`Meta Ads Event Failed: ${eventName}`, eventLog);
        }
    }

    /**
     * Remove dados sensíveis do log
     */
    sanitizeData(data) {
        if (!data || typeof data !== 'object') {
            return data;
        }

        const sensitiveFields = [
            'password', 'token', 'access_token', 'api_key', 
            'secret', 'authorization', 'credit_card', 'ssn'
        ];

        const sanitized = { ...data };

        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '***HIDDEN***';
            }
        }

        // Sanitizar emails parcialmente (manter domínio para debug)
        if (sanitized.email && typeof sanitized.email === 'string') {
            const [user, domain] = sanitized.email.split('@');
            if (user && domain) {
                sanitized.email = `${user.slice(0, 2)}***@${domain}`;
            }
        }

        return sanitized;
    }

    /**
     * Cria um logger específico para um contexto
     */
    createContextLogger(context) {
        return {
            info: (message, data) => this.info(`[${context}] ${message}`, data),
            error: (message, error) => this.error(`[${context}] ${message}`, error),
            warn: (message, data) => this.warn(`[${context}] ${message}`, data),
            debug: (message, data) => this.debug(`[${context}] ${message}`, data),
            success: (message, data) => this.success(`[${context}] ${message}`, data)
        };
    }
}

module.exports = new Logger();