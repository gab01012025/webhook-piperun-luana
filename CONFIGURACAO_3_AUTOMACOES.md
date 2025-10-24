# 🎯 CONFIGURAÇÃO DAS 3 AUTOMAÇÕES - LUANA

**Data:** 24 de outubro de 2025

---

## ✅ CONFIRMAÇÃO: NO-SHOW PODE SER LEAD!

Sim Luana! No Meta Ads você **pode usar o evento Lead** tanto para:
- ✅ Reunião Agendada → Lead
- ✅ No-show → Lead

O Meta Ads aceita o mesmo tipo de evento múltiplas vezes. O importante é mapear corretamente:
- **Lead** = Qualquer interesse demonstrado
- **Purchase** = Venda fechada

---

## 🔧 3 AUTOMAÇÕES PARA CONFIGURAR NO PIPERUN

### 📍 **URL DO WEBHOOK (RENDER)**

**URL do seu servidor:**
```
https://webhook-piperun-luana.onrender.com/webhook/piperun
```

✅ Esta é a URL que você vai usar nas 3 automações do Piperun!

---

## 🎯 AUTOMAÇÃO 1 - REUNIÃO AGENDADA

### Configuração no Piperun:

**Nome da Automação:**
```
[Pré-Vendas] - [Primeira Reunião] - Enviar Lead Meta Ads
```

**Gatilho:**
- 📌 **Quando**: Uma oportunidade entrar na etapa
- 📌 **Funil**: Prospecção - Consórcio
- 📌 **Etapa**: Agendamento
- 📌 **Status**: Abertas

**Ação:**
- 📌 **Tipo**: Webhook - Envio de oportunidade para URL
- 📌 **URL**: `https://webhook-piperun-luana.onrender.com/webhook/piperun`
- 📌 **Método**: POST
- 📌 **Prioridade**: 999 (mais prioritário)
- 📌 **Execução**: Imediatamente

**Headers (Cabeçalhos):**
```
X-PRIVATE-TOKEN: Y2duc29yaTplb25zb3JjQHpcGydWyMDMwlQ
Content-Type: application/json
```

**Payload (Corpo da Requisição):**
```json
{
  "event_name": "Lead",
  "event_type": "opportunity_stage_change",
  "stage_name": "Agendamento",
  "person": {
    "name": "{{person.name}}",
    "email": "{{person.email}}",
    "phone": "{{person.phone}}"
  },
  "deal": {
    "id": "{{deal.id}}",
    "title": "{{deal.title}}",
    "value": "{{deal.value}}",
    "status": "{{deal.status}}"
  },
  "timestamp": "{{current_timestamp}}",
  "source": "Piperun - Agendamento"
}
```

---

## 🎯 AUTOMAÇÃO 2 - NO-SHOW

### Configuração no Piperun:

**Nome da Automação:**
```
[Pré-Vendas] - [No-Show] - Enviar Lead Meta Ads
```

**Gatilho:**
- 📌 **Quando**: Uma oportunidade entrar na etapa
- 📌 **Funil**: Prospecção - Consórcio
- 📌 **Etapa**: No-show
- 📌 **Status**: Abertas

**Ação:**
- 📌 **Tipo**: Webhook - Envio de oportunidade para URL
- 📌 **URL**: `https://webhook-piperun-luana.onrender.com/webhook/piperun`
- 📌 **Método**: POST
- 📌 **Prioridade**: 999
- 📌 **Execução**: Imediatamente

**Headers:**
```
X-PRIVATE-TOKEN: Y2duc29yaTplb25zb3JjQHpcGydWyMDMwlQ
Content-Type: application/json
```

**Payload:**
```json
{
  "event_name": "Lead",
  "event_type": "opportunity_stage_change",
  "stage_name": "No-show",
  "person": {
    "name": "{{person.name}}",
    "email": "{{person.email}}",
    "phone": "{{person.phone}}"
  },
  "deal": {
    "id": "{{deal.id}}",
    "title": "{{deal.title}}",
    "value": "{{deal.value}}",
    "status": "{{deal.status}}"
  },
  "timestamp": "{{current_timestamp}}",
  "source": "Piperun - No-show"
}
```

---

## 🎯 AUTOMAÇÃO 3 - GANHO (VENDA FECHADA)

### Configuração no Piperun:

**Nome da Automação:**
```
[Vendas] - [Ganho] - Enviar Purchase Meta Ads
```

**Gatilho:**
- 📌 **Quando**: Uma oportunidade mudar para status
- 📌 **Funil**: Prospecção - Consórcio
- 📌 **Status**: Ganho (ou "Ganho")
- 📌 **Qualquer etapa**: Sim

**Ação:**
- 📌 **Tipo**: Webhook - Envio de oportunidade para URL
- 📌 **URL**: `https://webhook-piperun-luana.onrender.com/webhook/piperun`
- 📌 **Método**: POST
- 📌 **Prioridade**: 999
- 📌 **Execução**: Imediatamente

**Headers:**
```
X-PRIVATE-TOKEN: Y2duc29yaTplb25zb3JjQHpcGydWyMDMwlQ
Content-Type: application/json
```

**Payload:**
```json
{
  "event_name": "Purchase",
  "event_type": "opportunity_won",
  "stage_name": "Ganho",
  "person": {
    "name": "{{person.name}}",
    "email": "{{person.email}}",
    "phone": "{{person.phone}}"
  },
  "deal": {
    "id": "{{deal.id}}",
    "title": "{{deal.title}}",
    "value": "{{deal.value}}",
    "currency": "BRL",
    "status": "Ganho"
  },
  "custom_data": {
    "value": "{{deal.value}}",
    "currency": "BRL"
  },
  "timestamp": "{{current_timestamp}}",
  "source": "Piperun - Ganho"
}
```

---

## 📝 PASSO A PASSO RESUMIDO

### Para cada automação:

1. **Acessar Piperun** → Configurações → Automações
2. **Criar nova automação**
3. **Configurar o gatilho** (quando vai disparar)
4. **Adicionar ação webhook**
5. **Inserir URL** do seu servidor
6. **Adicionar headers** de autenticação
7. **Configurar payload** com os dados
8. **Salvar e ativar**

---

## ✅ VALIDAÇÃO APÓS CONFIGURAR:

### 1. Testar cada automação:
- Mover uma oportunidade teste para cada etapa
- Verificar se dispara o webhook
- Conferir logs do servidor Render

### 2. Validar no Meta Events Manager:
- Acessar Events Manager
- Verificar se eventos aparecem
- Status deve ser **"Received"** (verde)
- Confirmar dados corretos

### 3. Monitorar primeiros dias:
- Acompanhar eventos chegando
- Verificar taxa de correspondência
- Ajustar se necessário

---

## 🎯 MAPEAMENTO FINAL:

| Etapa Piperun | Evento Meta Ads | Objetivo |
|--------------|-----------------|----------|
| Agendamento | Lead | Rastrear interesse inicial |
| No-show | Lead | Rastrear tentativas |
| Ganho | Purchase | Rastrear conversões |

---

## 💡 DICA IMPORTANTE:

O Meta Ads vai usar esses eventos para:
1. **Otimizar campanhas** para pessoas que viram Lead
2. **Criar públicos semelhantes** baseado em quem converteu
3. **Atribuir corretamente** as vendas às campanhas
4. **Melhorar o algoritmo** de entrega de anúncios

Quanto mais eventos você enviar, melhor o Meta Ads vai aprender e otimizar suas campanhas! 🚀

---

## 📞 PRÓXIMOS PASSOS:

1. ✅ **Definir URL do servidor** (onde vai rodar)
2. ✅ **Configurar as 3 automações** seguindo este guia
3. ✅ **Fazer teste** com oportunidade real
4. ✅ **Validar no Events Manager**
5. ✅ **Ativar em produção**

---

**📝 Observação:** Se precisar de ajuda para definir a URL ou configurar o servidor em produção, me avisa que te ajudo! 🎯
