# 🚀 COMANDOS PÓS-DEPLOY - v1.0-capi-prod

## ✅ Status: DEPLOY CONCLUÍDO

**Tag:** v1.0-capi-prod  
**Commit:** ae935a2  
**Data:** 29/10/2025  
**Branch:** master

---

## 📋 PRÓXIMOS PASSOS

### 1. ⏳ Aguardar Deploy no Render (2-3 minutos)

Acesse: https://dashboard.render.com/web/webhook-piperun-luana

**Verificar:**
- [ ] Status: "Live" (verde)
- [ ] Deploy do commit ae935a2 concluído
- [ ] Logs mostram "Servidor iniciado"

---

### 2. 🧪 Validar Credenciais

```bash
cd /home/gabifran/Projeto\ Luana
node validate-events.js
```

**Resultado esperado:**
```
=============================================================
VALIDAÇÃO DE EVENTOS META CAPI
=============================================================
URL do Webhook: https://webhook-piperun-luana.onrender.com
Total de eventos para testar: 3

→ Testando evento: Reuniao_Agendada
✓ Reuniao_Agendada - Sucesso!
  FBTrace ID: A...
  Tempo: 500ms
  Ambiente: TESTE

→ Testando evento: No_Show
✓ No_Show - Sucesso!
  FBTrace ID: A...
  Tempo: 480ms
  Ambiente: TESTE

→ Testando evento: Venda
✓ Venda - Sucesso!
  FBTrace ID: A...
  Tempo: 520ms
  Ambiente: TESTE

=============================================================
RESULTADO DA VALIDAÇÃO
=============================================================
Sucessos: 3
Falhas: 0

✓ TODOS OS EVENTOS FUNCIONARAM CORRETAMENTE!
```

**Se falhar:** Verifique `.env` e credenciais do Meta.

---

### 3. ✅ Ativar Produção no Render

**Opção A: Via Dashboard Render**
1. Acesse: https://dashboard.render.com/web/webhook-piperun-luana
2. Vá em: Environment
3. Edite: `ENABLE_TEST_MODE` = false
4. Clique em: Save Changes
5. Deploy automático será disparado

**Opção B: Via .env local e push**
```bash
# Edite .env
ENABLE_TEST_MODE=false

# Commit e push
git add .env
git commit -m "prod: Ativar modo produção"
git push origin master
```

---

### 4. 🔍 Verificar Modo Produção

```bash
curl https://webhook-piperun-luana.onrender.com/
```

**Resposta esperada:**
```json
{
  "message": "Webhook Piperun to Meta Ads - Production Ready",
  "status": "active",
  "environment": "production",
  "webhook_url": "/webhook/piperun",
  "version": "2.0.0"
}
```

**Confirme:** `"environment": "production"`

---

### 5. 💚 Health Check

```bash
curl https://webhook-piperun-luana.onrender.com/health
```

**Resposta esperada:**
```json
{
  "status": "healthy",
  "environment": "production",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

### 6. 📊 Testar Evento Real

**No Piperun:**
1. Crie uma oportunidade real (ou use uma existente)
2. Mova para etapa "Agendamento"
3. Aguarde 10 segundos

**Verificar Logs no Render:**
```json
{
  "timestamp": "2025-10-29T...",
  "level": "success",
  "message": "meta_event_sent",
  "data": {
    "event_name": "Reuniao_Agendada",
    "external_id": "hash...",
    "fbtrace_id": "A...",
    "events_received": 1,
    "status": "success",
    "fb_diagnostics": [],
    "is_production": true
  }
}
```

**Confirme:** 
- ✅ `"message": "meta_event_sent"`
- ✅ `"status": "success"`
- ✅ `"is_production": true` (implícito)
- ✅ Sem "test_event_code" no log

---

### 7. 🎯 Verificar no Meta Events Manager

**Aguarde 15-30 minutos**, depois:

1. Acesse: https://business.facebook.com/events_manager2
2. Selecione Pixel: 609508655369916
3. Vá em: **"Visão Geral"** (NÃO "Eventos de Teste")
4. Verifique: Evento "Reuniao_Agendada" aparece

**Importante:**
- Eventos de **PRODUÇÃO** aparecem em "Visão Geral"
- Eventos de **TESTE** aparecem em "Eventos de Teste"

---

### 8. 📈 Aguardar Métricas (24-48h)

**Após 24-48 horas:**

1. Acesse: https://business.facebook.com/adsmanager
2. Vá em: Campanhas
3. Colunas → Personalizar Colunas
4. Adicione: Reuniao_Agendada, No_Show, Venda
5. Verifique: Números começam a aparecer

---

## 🔄 Comandos de Manutenção

### Ver Logs em Tempo Real

**No Render Dashboard:**
- Vá em: Logs
- Ative: Live tail

**Ou via CLI:**
```bash
render logs -f webhook-piperun-luana
```

### Reiniciar Servidor

**Se necessário:**
1. Dashboard Render
2. Manual Deploy
3. Deploy Latest Commit

### Voltar para Modo Teste

**Se precisar testar algo:**
```bash
# Edite .env
ENABLE_TEST_MODE=true
META_TEST_CODE=TEST82947

# Reinicie servidor
```

---

## 📊 Monitoramento Contínuo

### Diário (Primeira Semana)
- [ ] Verificar eventos chegando no Meta
- [ ] Conferir taxa de correspondência > 70%
- [ ] Validar logs de erro (deve ser 0%)

### Semanal
- [ ] Analisar métricas no Ads Manager
- [ ] Verificar custo por conversão
- [ ] Otimizar campanhas com base nos dados

---

## 🆘 Troubleshooting

### Eventos não aparecem no Meta

**Verificar:**
1. Logs mostram "meta_event_sent"?
2. fbtrace_id presente?
3. ENABLE_TEST_MODE=false?
4. Aguardou 24-48h?
5. Olhando em "Visão Geral" (não "Eventos de Teste")?

### Taxa de correspondência baixa

**Melhorar:**
- Certificar que email/telefone estão sendo capturados
- Adicionar fbc/fbp aos payloads do Piperun
- Validar hashes SHA256

### Erros nos logs

**Analisar:**
```bash
# Ver apenas erros
render logs webhook-piperun-luana | grep "error"

# Ver fb_diagnostics
render logs webhook-piperun-luana | grep "fb_diagnostics"
```

---

## ✅ Checklist Pós-Deploy

- [ ] Deploy concluído no Render
- [ ] validate-events.js executado com sucesso
- [ ] ENABLE_TEST_MODE=false ativado
- [ ] Health check retorna 200 OK
- [ ] Primeiro evento real enviado
- [ ] Log mostra meta_event_sent
- [ ] Evento aparece no Meta (aguardar 15-30min)
- [ ] Documentação entregue para Luana
- [ ] Equipe treinada para usar métricas

---

## 🎉 PROJETO CONCLUÍDO!

**Versão:** v1.0-capi-prod  
**Status:** ✅ EM PRODUÇÃO  
**Próxima revisão:** 7 dias

**Contato:** Gabriel (Desenvolvedor)

---

**Última atualização:** 29/10/2025
