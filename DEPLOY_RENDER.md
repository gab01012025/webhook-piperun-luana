# 🚀 DEPLOY NO RENDER - INSTRUÇÕES

## ✅ PRÉ-REQUISITOS
- Código no GitHub (repositório: webhook-piperun-luana)
- Conta no Render.com

---

## 📝 PASSO A PASSO

### 1. **Criar Novo Web Service no Render**
1. Acessar [render.com](https://render.com)
2. Fazer login
3. Clicar em **"New +"** → **"Web Service"**
4. Conectar repositório GitHub: `gab01012025/webhook-piperun-luana`
5. Branch: `master`

### 2. **Configurações Básicas**
```
Name: webhook-piperun-luana
Region: Oregon (US West)
Branch: master
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 3. **Variáveis de Ambiente**

Adicionar as seguintes variáveis em **Environment**:

```bash
# Meta Ads - DADOS DA LUANA
META_PIXEL_ID=609508655369916
META_ACCESS_TOKEN=EAGxqkHYkL2MBP1obdbk5d6q1romBkPPkT6vIDVHoEGIx483XEOezPYd8yaEyl3813VvVpEdx7EIMUN46d6Sd6rVbzVQcFI8jrUZAmRRA6CpcQshCLZCGeORIb8WV0WcLkZCnmeFwDUwAbHDX4q51lVgNEgd222FGSs1WFDCgUAu56TesVRp2N9T6QoTCQZDZD
META_TEST_CODE=TEST82947

# Piperun
PIPERUN_WEBHOOK_URL=https://piperun-87856205922.us-central1.run.app/piperun/webhook
PIPERUN_API_TOKEN=Y2duc29yaTplb25zb3JjQHpcGydWyMDMwlQ
PIPERUN_AUTH_HEADER=X-PRIVATE-TOKEN

# Server
NODE_ENV=production
PORT=10000

# Logging
LOG_LEVEL=info
ENABLE_DEBUG=false

# Event Config
DEFAULT_EVENT_NAME=Lead
ENABLE_TEST_MODE=true
```

### 4. **Criar o Serviço**
- Clicar em **"Create Web Service"**
- Aguardar o deploy (2-3 minutos)

### 5. **Verificar URL Gerada**
O Render vai gerar a URL:
```
https://webhook-piperun-luana.onrender.com
```

---

## ✅ VALIDAÇÃO

### 1. Testar endpoint principal:
```bash
curl https://webhook-piperun-luana.onrender.com/
```

**Resposta esperada:**
```json
{
  "message": "Webhook Piperun to Meta Ads",
  "status": "active",
  "webhook_url": "/webhook/piperun"
}
```

### 2. Testar webhook:
```bash
curl -X POST https://webhook-piperun-luana.onrender.com/webhook/piperun \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","telephone":"11999999999"}'
```

---

## 🔧 MANUTENÇÃO

### Ver Logs:
1. Dashboard do Render
2. Selecionar o serviço
3. Aba **"Logs"**

### Atualizar Código:
1. Fazer push no GitHub
2. Render faz deploy automático

### Redeploy Manual:
1. Dashboard → Serviço
2. Botão **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🎯 PRÓXIMOS PASSOS

Após deploy bem-sucedido:
1. ✅ Configurar as 3 automações no Piperun
2. ✅ Usar URL: `https://webhook-piperun-luana.onrender.com/webhook/piperun`
3. ✅ Testar com oportunidade real
4. ✅ Validar no Meta Events Manager

---

## ⚠️ IMPORTANTE - PLANO FREE DO RENDER

O plano gratuito do Render:
- ✅ Servidor hiberna após 15 min sem uso
- ✅ Primeira requisição pode demorar 30-60s (cold start)
- ✅ 750 horas/mês grátis
- ❌ Sem HTTPS automático

**Solução:** Para produção, considerar upgrade para plano pago ($7/mês) que mantém servidor sempre ativo.

---

## 📞 SUPORTE

Se houver erro no deploy:
1. Verificar logs no Render
2. Confirmar todas as variáveis de ambiente
3. Verificar se `package.json` tem todas as dependências
4. Conferir se `npm start` funciona localmente

**URL da documentação oficial:** [render.com/docs](https://render.com/docs)
