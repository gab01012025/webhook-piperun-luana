# Guia de Instalação e Configuração

## 📋 Pré-requisitos

### 1. Ambiente de Desenvolvimento
- Node.js 16+ instalado
- npm ou yarn
- Git
- Editor de código (recomendado: VS Code)

### 2. Credenciais Necessárias
- **Meta Ads**:
  - Pixel ID
  - Access Token
  - Test Event Code (opcional, para testes)
- **Piperun**:
  - URL do webhook (já configurada)
  - Token de API (se necessário)

## 🚀 Instalação

### 1. Clonar/Baixar o Projeto
```bash
cd /home/gabifran/Projeto\ Luana
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com suas credenciais
nano .env
```

### 4. Configurar .env
```env
# Meta Ads Configuration
META_PIXEL_ID=seu_pixel_id_aqui
META_ACCESS_TOKEN=seu_access_token_aqui
META_TEST_CODE=seu_test_code_aqui

# Piperun Configuration  
PIPERUN_WEBHOOK_URL=https://piperun-87856205922.us-central1.run.app/piperun/webhook
PIPERUN_API_TOKEN=seu_token_piperun_aqui

# Server Configuration
PORT=3000
NODE_ENV=production

# Logging
LOG_LEVEL=info
ENABLE_DEBUG=false
```

## ⚙️ Como Obter Credenciais

### Meta Ads - Pixel ID
1. Acesse [Meta Business Manager](https://business.facebook.com/)
2. Vá em **Eventos** → **Pixels**
3. Copie o **ID do Pixel**

### Meta Ads - Access Token
1. Acesse [Meta for Developers](https://developers.facebook.com/)
2. Vá em **Ferramentas** → **Explorador da API do Graph**
3. Selecione seu app
4. Gere token com permissões: `ads_management`, `business_management`
5. **IMPORTANTE**: Use token de longa duração

### Meta Ads - Test Event Code
1. No Events Manager, acesse seu Pixel
2. Vá em **Teste de Eventos**
3. Copie o **Código de Teste**

## 🏃‍♂️ Executar o Sistema

### 1. Modo Desenvolvimento
```bash
npm run dev
```

### 2. Modo Produção
```bash
npm start
```

### 3. Executar Testes
```bash
# Todos os testes
npm test

# Apenas diagnóstico
node test/test-webhook.js --diagnostic
```

## 🔍 Verificação da Instalação

### 1. Acessar Interface Web
```
http://localhost:3000
```

### 2. Testar Conexões
```
http://localhost:3000/test-connection
```

### 3. Executar Diagnóstico
```
http://localhost:3000/diagnostic
```

## 🎯 Configurar no Piperun

### 1. Criar Nova Automação
1. Acesse **Configurações** → **Automações**
2. Clique em **+ Nova Automação**
3. Configure conforme `AUTOMATION_SETUP.md`

### 2. URL do Webhook
```
http://SEU_SERVIDOR:3000/webhook/piperun
```

### 3. Configurar Gatilho
- **Quando**: Oportunidade entrar na etapa
- **Funil**: Prospecção - Consórcio
- **Etapa**: Agendamento

## 📊 Monitoramento

### 1. Logs do Sistema
```bash
# Ver logs em tempo real
tail -f logs/app-$(date +%Y-%m-%d).log
```

### 2. Meta Events Manager
1. Acesse [Events Manager](https://business.facebook.com/events_manager/)
2. Selecione seu Pixel
3. Verifique eventos com status **"Received"** (verde)

### 3. Endpoints de Monitoramento
- **Status**: `GET /`
- **Saúde**: `GET /test-connection`
- **Diagnóstico**: `GET /diagnostic`

## 🚀 Deploy em Produção

### 1. Servidor (Recomendado: DigitalOcean, AWS, etc.)
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar projeto
git clone <seu-repositorio>
cd projeto

# Instalar dependências
npm ci --production

# Configurar PM2 (Process Manager)
npm install -g pm2
pm2 start app.js --name "piperun-meta-webhook"
pm2 startup
pm2 save
```

### 2. Configurar Nginx (Opcional)
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL/HTTPS (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## 🔧 Solução de Problemas

### Erro: "Meta Ads credentials not configured"
- Verifique se `META_PIXEL_ID` e `META_ACCESS_TOKEN` estão no `.env`
- Confirme se o token tem as permissões corretas

### Erro: "Connection refused"
- Verifique se o servidor está rodando
- Confirme a porta no `.env`
- Teste conectividade: `curl http://localhost:3000`

### Eventos não chegam no Meta
- Verifique se o Test Event Code está correto
- Confirme se o Pixel ID está ativo
- Teste com endpoint `/test-connection`

### Webhook do Piperun falha
- Verifique URL do webhook na automação
- Confirme se servidor está acessível externamente
- Teste payload manualmente

## 📞 Suporte

### Logs Detalhados
```bash
# Ativar debug
export ENABLE_DEBUG=true
npm start
```

### Contatos
- **Técnico**: Equipe de desenvolvimento
- **Funcional**: Luana Ribeiro  
- **Piperun**: Suporte técnico da plataforma

## 📚 Documentação Adicional
- [README.md](./README.md) - Visão geral do projeto
- [AUTOMATION_SETUP.md](./AUTOMATION_SETUP.md) - Configuração detalhada da automação
- Logs: `./logs/`
- Testes: `npm test`