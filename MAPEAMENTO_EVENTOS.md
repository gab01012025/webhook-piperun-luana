# MAPEAMENTO DE EVENTOS - PIPERUN → META ADS

## Gatilhos Configurados

### 1. Agendamento → Reuniao_Agendada

**Piperun:**
- **Gatilho:** Oportunidade move para etapa "Agendamento"
- **Funil:** Prospecção - Consórcio

**Payload enviado:**
```json
{
  "event_name": "Reuniao_Agendada",
  "person": {
    "email": "{{person.email}}",
    "phone": "{{person.phone}}"
  },
  "id": "{{opportunity.id}}"
}
```

**Meta Ads recebe:**
- `event_name`: "Reuniao_Agendada"
- `event_time`: Unix timestamp (epoch int)
- `action_source`: "website"
- `event_id`: "{opportunity_id}_Reuniao_Agendada_{timestamp}"
- `event_source_url`: "https://consori.com.br"
- `user_data`:
  - `em`: SHA256 hash do email
  - `ph`: SHA256 hash do telefone
  - `client_ip_address`: IP do servidor/usuário
  - `client_user_agent`: User Agent do request
  - `external_id`: SHA256 hash do opportunity ID
  - `fbc`: Cookie Meta Click ID (se disponível)
  - `fbp`: Cookie Meta Pixel (se disponível)

---

### 2. No-show → No_Show

**Piperun:**
- **Gatilho:** Oportunidade move para etapa "No-show"
- **Funil:** Prospecção - Consórcio

**Payload enviado:**
```json
{
  "event_name": "No_Show",
  "person": {
    "email": "{{person.email}}",
    "phone": "{{person.phone}}"
  },
  "id": "{{opportunity.id}}"
}
```

**Meta Ads recebe:**
- `event_name`: "No_Show"
- `event_time`: Unix timestamp (epoch int)
- `action_source`: "website"
- `event_id`: "{opportunity_id}_No_Show_{timestamp}"
- `event_source_url`: "https://consori.com.br"
- `user_data`: (mesma estrutura do Agendamento)

---

### 3. Venda → Venda

**Piperun:**
- **Gatilho:** Oportunidade marcada como "Ganho"
- **Funil:** Prospecção - Consórcio

**Payload enviado:**
```json
{
  "event_name": "Venda",
  "person": {
    "email": "{{person.email}}",
    "phone": "{{person.phone}}"
  },
  "deal": {
    "value": "{{deal.value}}"
  },
  "id": "{{opportunity.id}}"
}
```

**Meta Ads recebe:**
- `event_name`: "Venda"
- `event_time`: Unix timestamp (epoch int)
- `action_source`: "website"
- `event_id`: "{opportunity_id}_Venda_{timestamp}"
- `event_source_url`: "https://consori.com.br"
- `user_data`: (mesma estrutura do Agendamento)
- **`custom_data`**:
  - `value`: Valor da venda (float)
  - `currency`: "BRL"
  - `content_name`: "Consorcio"
  - `content_type`: "product"

---

## Validação do Payload CAPI

### Campos Obrigatórios (✅ Implementados)

- ✅ `event_name`: String personalizada
- ✅ `event_time`: Unix epoch (integer)
- ✅ `action_source`: "website" (fixo)
- ✅ `event_id`: Determinístico (deduplicação)
- ✅ `user_data.em`: Email SHA256
- ✅ `user_data.ph`: Telefone SHA256
- ✅ `user_data.client_ip_address`: IP capturado
- ✅ `user_data.client_user_agent`: User Agent capturado
- ✅ `user_data.external_id`: SHA256 do opportunity ID

### Campos Opcionais (✅ Implementados)

- ✅ `user_data.fbc`: Meta Click ID (se disponível)
- ✅ `user_data.fbp`: Meta Pixel ID (se disponível)
- ✅ `event_source_url`: URL de origem
- ✅ `custom_data`: Para eventos Venda (valor + moeda)

### Campos NÃO Enviados em Produção

- ❌ `test_event_code`: Removido quando `ENABLE_TEST_MODE=false`

---

## Configuração do Webhook no Piperun

**URL:** https://webhook-piperun-luana.onrender.com/webhook/piperun

**Header:**
```
X-PRIVATE-TOKEN: Y2duc29yaTplb25zb3JjQHpcGydWyMDMwlQ
```

**Método:** POST

**Content-Type:** application/json

---

## Logs Estruturados

### Evento Enviado com Sucesso
```json
{
  "timestamp": "2025-10-29T...",
  "level": "success",
  "message": "meta_event_sent",
  "data": {
    "event_name": "Venda",
    "external_id": "hash_opportunity_id",
    "fbtrace_id": "A...",
    "events_received": 1,
    "status": "success",
    "fb_diagnostics": []
  }
}
```

### Evento com Erro
```json
{
  "timestamp": "2025-10-29T...",
  "level": "error",
  "message": "meta_event_error",
  "data": {
    "event_name": "Venda",
    "external_id": "hash_opportunity_id",
    "status_code": 400,
    "status": "error",
    "fb_diagnostics": ["Invalid parameter"],
    "response": {...}
  }
}
```

---

## Fluxo Completo

```
1. Oportunidade muda no Piperun
   ↓
2. Piperun envia webhook (POST)
   ↓
3. app-production.js recebe
   ↓
4. Extrai: email, telefone, ID, fbc, fbp
   ↓
5. Captura: IP, User Agent
   ↓
6. Gera hashes SHA256
   ↓
7. Cria event_id único
   ↓
8. Monta payload CAPI completo
   ↓
9. Envia para Meta (com retry 3x)
   ↓
10. Log: meta_event_sent ou meta_event_error
   ↓
11. Meta processa (imediato para teste, 24-48h prod)
   ↓
12. Aparece em Events Manager
   ↓
13. Aparece em Ads Manager (colunas)
```

---

## Checklist de Validação

### Pré-Deploy
- [x] ENABLE_TEST_MODE padrão = false
- [x] test_event_code removido em produção
- [x] Todos campos CAPI implementados
- [x] Mapeamento Piperun → Meta correto
- [x] Endpoint /health retorna 200 OK
- [x] Logs estruturados implementados

### Pós-Deploy
- [ ] node validate-events.js executado
- [ ] ENABLE_TEST_MODE=false testado
- [ ] Eventos aparecem no Meta (24-48h)
- [ ] Colunas no Ads Manager funcionando
- [ ] Monitoramento ativo

---

**Versão:** v1.0-capi-prod
**Data:** 29/10/2025
**Status:** ✅ Pronto para Produção
