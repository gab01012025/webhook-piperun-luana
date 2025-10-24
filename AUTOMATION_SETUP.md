# Configuração da Automação Piperun → Meta Ads

## Ação Automática no Piperun

### 1. Nome da Ação
**[Pré - Vendas] - [Primeira Reunião] - Disparo de Informações Meta Ads**

### 2. Configuração do Gatilho
- **Quando ocorrer**: Uma oportunidade entrar na etapa
- **Funil**: Prospecção - Consórcio  
- **Etapa**: Agendamento
- **Status**: Abertas

### 3. Configuração da Ação
- **Tipo de Ação**: Webhook - Envio de oportunidade para URL
- **Prioridade**: 999 (Mais prioritário)
- **Execução**: Imediatamente

### 4. URL do Webhook
```
https://piperun-87856205922.us-central1.run.app/piperun/webhook
```

### 5. Mapeamento de Campos

#### Dados da Pessoa
- `person.name` → Nome completo
- `person.email` → Email principal
- `person.phone` → Telefone principal

#### Dados do Negócio
- `deal.id` → ID da oportunidade
- `deal.title` → Título da oportunidade
- `deal.status` → Status atual
- `deal.stage` → Etapa atual
- `deal.value` → Valor da oportunidade
- `deal.currency` → Moeda (BRL)

#### Dados de Contexto
- `event_name` → "Lead" (para essa etapa)
- `source` → "Piperun"
- `timestamp` → Data/hora atual
- `funnel_name` → "Prospecção - Consórcio"
- `stage_name` → "Agendamento"

### 6. Payload JSON Exemplo
```json
{
  "event_type": "opportunity_stage_change",
  "person": {
    "id": "{{person.id}}",
    "name": "{{person.name}}",
    "email": "{{person.email}}",
    "phone": "{{person.phone}}"
  },
  "deal": {
    "id": "{{deal.id}}",
    "title": "{{deal.title}}",
    "status": "{{deal.status}}",
    "stage": "{{deal.stage}}",
    "value": "{{deal.value}}",
    "currency": "BRL"
  },
  "event_info": {
    "event_name": "Lead",
    "source": "Piperun",
    "funnel": "Prospecção - Consórcio",
    "stage": "Agendamento",
    "timestamp": "{{deal.updated_at}}"
  }
}
```

## Critérios de Mapeamento de Eventos

### Por Etapa do Funil
| Etapa Piperun | Evento Meta Ads | Descrição |
|---------------|----------------|-----------|
| Agendamento | Lead | Primeiro contato qualificado |
| Reunião Realizada | InitiateCheckout | Demonstração/apresentação |
| Proposta Enviada | AddToCart | Interesse confirmado |
| Negociação | InitiateCheckout | Em processo de fechamento |
| Fechado/Ganho | Purchase | Conversão confirmada |

### Por Status
| Status | Evento Meta Ads | Observações |
|--------|----------------|-------------|
| Aberto | Lead | Status ativo |
| Em Negociação | InitiateCheckout | Processo avançado |
| Ganho | Purchase | Conversão |
| Perdido | Lead | Manter para análise |

## Configurações Avançadas

### Headers HTTP
```
Content-Type: application/json
X-Piperun-Source: automation
X-Webhook-Version: 1.0
```

### Retry Policy
- **Tentativas**: 3 tentativas
- **Intervalo**: 30 segundos entre tentativas
- **Timeout**: 30 segundos por tentativa

### Logs e Monitoramento
- Ativar log de tentativas
- Alertar em caso de falhas consecutivas
- Notificar responsável em caso de erro

## Outras Automações Sugeridas

### 2. Proposta Enviada
```
Nome: [Pré - Vendas] - [Proposta] - Meta Ads Checkout Event
Gatilho: Etapa "Proposta Enviada"
Evento: InitiateCheckout
```

### 3. Fechamento Ganho
```
Nome: [Pós - Vendas] - [Fechamento] - Meta Ads Purchase Event  
Gatilho: Status "Ganho"
Evento: Purchase
```

### 4. Lead Qualificado
```
Nome: [Marketing] - [Lead] - Meta Ads Lead Event
Gatilho: Tag "Qualificado" adicionada
Evento: Lead
```

## Validação da Integração

### 1. Teste Manual
1. Criar oportunidade teste
2. Mover para etapa "Agendamento"  
3. Verificar disparo do webhook
4. Confirmar recebimento no Meta Events Manager

### 2. Monitoramento
- Acessar Meta Events Manager
- Verificar eventos com status "Received" (verde)
- Confirmar dados corretos nos eventos
- Validar matching com usuários do Facebook

### 3. Logs de Sistema  
- Verificar logs no servidor webhook
- Confirmar processamento sem erros
- Validar formatação dos dados enviados

## Troubleshooting

### Problemas Comuns
1. **Webhook não dispara**: Verificar configuração da automação
2. **Erro 400**: Dados inválidos ou malformados
3. **Erro 401**: Token de acesso inválido
4. **Erro 500**: Problema no servidor de destino

### Contatos para Suporte
- **Desenvolvedor**: Equipe Técnica Luana
- **Piperun**: Suporte técnico da plataforma  
- **Meta**: Business Help Center

## Documentação Adicional
- [API Conversions Meta Ads](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Automações Piperun](https://help.piperun.com/automacoes)
- [Webhooks Best Practices](https://docs.piperun.com/webhooks)