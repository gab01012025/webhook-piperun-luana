# 🔗 Webhook Piperun → Meta Ads (Facebook Conversions API)

Sistema de integração para enviar eventos do CRM Piperun para a Meta Ads Conversions API (CAPI), permitindo rastreamento preciso de conversões para otimização de campanhas.

## 🎯 Funcionalidades

- ✅ Recebe webhooks do Piperun automaticamente
- ✅ Extrai dados de contato (email, telefone) de múltiplos formatos
- ✅ Hash SHA256 para dados sensíveis (LGPD/GDPR compliant)
- ✅ Envia eventos personalizados para Meta Ads
- ✅ Suporte a eventos: `Reuniao_Agendada`, `No_Show`, `Venda`
- ✅ Logs detalhados para debugging
- ✅ Health check endpoint

## 🛠️ Tecnologias

- **Node.js** + Express
- **Meta Conversions API** v18.0
- **Crypto** (SHA256 hashing)
- Deploy: Render / cPanel

## 📁 Estrutura do Projeto

```
├── app.js                 # Servidor principal
├── src/
│   ├── services/
│   │   ├── metaAdsService.js    # Integração com Meta CAPI
│   │   ├── piperunService.js    # Parser de dados Piperun
│   │   └── webhookDiagnostic.js # Diagnóstico de conexão
│   └── utils/
│       └── logger.js            # Sistema de logs
├── test/
│   └── test-webhook.js    # Testes do webhook
├── Dockerfile
├── package.json
└── .env.example
```

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/gab01012025/webhook-piperun-luana.git
cd webhook-piperun-luana
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:
```env
META_PIXEL_ID=seu_pixel_id
META_ACCESS_TOKEN=seu_access_token
META_TEST_CODE=TEST12345  # Opcional, para testes
DEFAULT_EVENT_NAME=Reuniao_Agendada
PORT=3000
```

### 4. Execute o servidor
```bash
npm start
```

## 🐳 Docker

```bash
# Build
docker build -t webhook-piperun .

# Run
docker run -p 3000:3000 --env-file .env webhook-piperun
```

## 📡 Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Status da API |
| POST | `/webhook/piperun` | Recebe eventos do Piperun |
| GET | `/health` | Health check |

## 🔧 Configuração no Piperun

1. Acesse **Configurações** → **Automações**
2. Crie uma nova automação
3. Configure o webhook URL: `https://sua-url.com/webhook/piperun`
4. Selecione os eventos desejados (mudança de etapa, etc)

## 📊 Eventos Suportados

| Evento | Descrição | Custom Data |
|--------|-----------|-------------|
| `Reuniao_Agendada` | Lead agendou reunião | - |
| `No_Show` | Lead não compareceu | - |
| `Venda` | Negócio fechado | `value`, `currency` |

## 🧪 Testando

```bash
# Teste local
curl -X POST http://localhost:3000/webhook/piperun \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@email.com", "phone": "11999999999"}'
```

## 👨‍💻 Autor

**Gabriel Barreto**
- GitHub: [@gab01012025](https://github.com/gab01012025)
- LinkedIn: [Gabriel Barreto](https://linkedin.com/in/gabriel-barreto-610a72370)

## 📄 Licença

MIT License
