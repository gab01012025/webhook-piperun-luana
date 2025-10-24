# 🚀 GUIA RÁPIDO - LUANA

**URL do Servidor (Render):**
```
https://webhook-piperun-luana.onrender.com/webhook/piperun
```

---

## 🎯 3 AUTOMAÇÕES PARA CONFIGURAR

### 1️⃣ AGENDAMENTO → REUNIÃO AGENDADA

**Piperun → Automações → Nova Automação**

**Gatilho:**
- Etapa: **Agendamento**
- Funil: Prospecção - Consórcio

**Ação: Webhook**
```
URL: https://webhook-piperun-luana.onrender.com/webhook/piperun
Header: X-PRIVATE-TOKEN: Y2duc29yaTplb25zb3JjQHpcGydWyMDMwlQ
```

**Payload:**
```json
{
  "event_name": "Reuniao_Agendada",
  "person": {
    "email": "{{person.email}}",
    "phone": "{{person.phone}}"
  }
}
```

---

### 2️⃣ NO-SHOW → NO-SHOW

**Gatilho:**
- Etapa: **No-show**
- Funil: Prospecção - Consórcio

**Ação: Webhook**
```
URL: https://webhook-piperun-luana.onrender.com/webhook/piperun
Header: X-PRIVATE-TOKEN: Y2duc29yaTplb25zb3JjQHpcGydWyMDMwlQ
```

**Payload:**
```json
{
  "event_name": "No_Show",
  "person": {
    "email": "{{person.email}}",
    "phone": "{{person.phone}}"
  }
}
```

---

### 3️⃣ GANHO → VENDA

**Gatilho:**
- Status: **Ganho**
- Funil: Prospecção - Consórcio

**Ação: Webhook**
```
URL: https://webhook-piperun-luana.onrender.com/webhook/piperun
Header: X-PRIVATE-TOKEN: Y2duc29yaTplb25zb3JjQHpcGydWyMDMwlQ
```

**Payload:**
```json
{
  "event_name": "Venda",
  "person": {
    "email": "{{person.email}}",
    "phone": "{{person.phone}}"
  },
  "deal": {
    "value": "{{deal.value}}"
  }
}
```

---

## ✅ TESTAR

1. Mover oportunidade teste para cada etapa
2. Verificar no Meta Events Manager se eventos aparecem verdes
3. Pronto! 🎉
