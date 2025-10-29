# GUIA COMPLETO - VISUALIZAR MÉTRICAS NO META ADS MANAGER

## 1. ONDE VER OS EVENTOS

### A. Gerenciador de Eventos (Validação)

Acesse: https://business.facebook.com/events_manager2

**Passo a passo:**
1. Selecione o Pixel: 609508655369916
2. Clique em "Visão Geral"
3. Veja os eventos recebidos nas últimas 24h

**O que verificar:**
- Total de eventos recebidos
- Eventos por tipo (Reuniao_Agendada, No_Show, Venda)
- Eventos com erros
- Taxa de correspondência (Match Rate)

**Eventos em Teste:**
- Aba "Eventos de Teste"
- Verá eventos com marcação verde
- Use o código: TEST82947

**Eventos em Produção:**
- Aba "Visão Geral"
- Eventos contam para métricas reais
- Aparecem nos relatórios de campanhas

### B. Gerenciador de Anúncios (Métricas por Campanha)

Acesse: https://business.facebook.com/adsmanager

**Passo a passo:**
1. Selecione "Campanhas" na barra lateral
2. Clique em "Colunas" (no topo da tabela)
3. Selecione "Personalizar Colunas"
4. Procure por:
   - Reuniao_Agendada
   - No_Show
   - Venda
   - Valor de conversão de Venda
5. Marque as caixas de seleção
6. Clique em "Aplicar"

**Resultado:** Você verá colunas mostrando:
```
| Campanha | Investimento | Leads | Reuniao_Agendada | No_Show | Venda | Valor Vendas |
|----------|--------------|-------|------------------|---------|-------|--------------|
| Carro 1  | R$ 500       | 25    | 5                | 2       | 1     | R$ 15.000    |
| Imóvel 1 | R$ 300       | 15    | 3                | 1       | 2     | R$ 30.000    |
```

## 2. COMO USAR AS MÉTRICAS

### A. Análise de Funil

**Calcule as taxas de conversão:**
- Taxa de Agendamento: (Reuniao_Agendada / Leads) × 100
- Taxa de Comparecimento: (Reuniao_Agendada - No_Show) / Reuniao_Agendada × 100
- Taxa de Fechamento: (Venda / Reuniao_Agendada) × 100

**Exemplo:**
```
Leads: 100
Reuniões: 20 (20% de conversão)
No-Shows: 5 (75% de comparecimento)
Vendas: 3 (15% de fechamento sobre reuniões)
```

### B. Otimização de Campanhas

**1. Criar Campanha Otimizada para Vendas:**
```
Nome: Consórcio - Otimizado para Venda
Objetivo: Conversões
Evento de conversão: Venda
Estratégia de lance: Menor custo por conversão
```

**2. Criar Campanha Otimizada para Reuniões:**
```
Nome: Consórcio - Otimizado para Agendamento
Objetivo: Conversões
Evento de conversão: Reuniao_Agendada
Estratégia de lance: Menor custo por conversão
```

**3. Criar Público de Reengajamento:**
```
Nome: Leads que marcaram No-Show
Público personalizado: Pessoas que dispararam evento "No_Show"
Use para: Remarketing com ofertas especiais
```

### C. Análise de ROI

**Calcular custo por venda:**
```
Custo por Venda = Investimento Total / Número de Vendas

Exemplo:
Investimento: R$ 1.000
Vendas: 2
Custo por Venda: R$ 500

Se ticket médio = R$ 15.000
ROI = (15.000 - 500) / 500 × 100 = 2.900%
```

## 3. CONFIGURAÇÃO DE RELATÓRIOS PERSONALIZADOS

### A. Criar Relatório de Funil Completo

**Passo a passo:**
1. Gerenciador de Anúncios → Colunas → Personalizar Colunas
2. Adicione estas métricas na ordem:
   - Nome da campanha
   - Valor gasto
   - Impressões
   - Cliques
   - Custo por clique (CPC)
   - Leads (formulário Meta)
   - Custo por lead
   - Reuniao_Agendada
   - Custo por Reuniao_Agendada
   - No_Show
   - Venda
   - Custo por Venda
   - Valor de conversão de Venda
   - ROAS (Retorno sobre investimento em anúncios)
3. Salve como: "Relatório Funil Completo"

### B. Exportar para Excel

**Passo a passo:**
1. Configure as colunas desejadas
2. Clique nos 3 pontos (...) no topo direito
3. Selecione "Exportar dados da tabela"
4. Escolha formato: Excel (.xlsx)
5. Baixe e analise no Excel

## 4. TEMPO DE ATUALIZAÇÃO

**Importante entender os delays:**

- **Eventos de Teste:** Aparecem imediatamente (1-5 minutos)
- **Eventos de Produção:** 
  - Primeiros eventos: 15-30 minutos
  - Métricas estabilizadas: 24-48 horas
  - Relatórios completos: 72 horas

**Janela de Atribuição:**
- Padrão: 7 dias após clique, 1 dia após visualização
- Ajustável nas configurações da campanha

## 5. MELHORES PRÁTICAS

### A. Monitoramento Diário

**Checklist matinal:**
1. Verificar eventos recebidos nas últimas 24h
2. Conferir taxa de correspondência (deve estar acima de 70%)
3. Analisar custo por evento
4. Identificar campanhas com melhor performance

### B. Análise Semanal

**Checklist semanal:**
1. Comparar performance semana vs semana anterior
2. Identificar padrões (dias/horários com melhor conversão)
3. Ajustar orçamento para campanhas com melhor ROI
4. Pausar campanhas com custo por venda muito alto

### C. Otimização Mensal

**Checklist mensal:**
1. Revisar públicos que convertem melhor
2. Testar novos criativos nos melhores públicos
3. Expandir campanhas vencedoras
4. Criar lookalikes dos compradores

## 6. TROUBLESHOOTING

### Eventos não aparecem?

**Verifique:**
1. Eventos estão sendo enviados? (Logs do servidor)
2. Pixel ID está correto?
3. Token de acesso válido?
4. Está olhando o período correto? (últimas 24-72h)
5. Modo teste ativado? (eventos não contam para produção)

### Taxa de correspondência baixa?

**Melhorar Match Rate:**
1. Certifique-se que email está sendo capturado
2. Adicione telefone aos dados
3. Capture cookies fbc/fbp do Meta Pixel
4. Adicione IP e User Agent (já implementado)

### Números inconsistentes?

**Possíveis causas:**
1. Janela de atribuição diferente
2. Conversões offline não contabilizadas
3. Múltiplos pixels na mesma página
4. Deduplicação de eventos (event_id)

## 7. DASHBOARD RECOMENDADO

**Layout ideal para acompanhamento:**

```
┌─────────────────────────────────────────────────────────┐
│  OVERVIEW - ÚLTIMAS 30 DIAS                             │
├─────────────────────────────────────────────────────────┤
│  Investimento: R$ 5.000                                 │
│  Leads: 250                                             │
│  Reuniões: 50 (20%)                                     │
│  No-Shows: 10 (20%)                                     │
│  Vendas: 8 (16%)                                        │
│  Receita: R$ 120.000                                    │
│  ROI: 2.300%                                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  POR CAMPANHA                                           │
├──────────────┬─────────┬────────┬─────────┬────────────┤
│ Campanha     │ Gasto   │ Leads  │ Vendas  │ ROI        │
├──────────────┼─────────┼────────┼─────────┼────────────┤
│ Carro 1      │ R$ 2K   │ 100    │ 5       │ 2.750%     │
│ Imóvel 1     │ R$ 1.5K │ 80     │ 2       │ 900%       │
│ Serviços 1   │ R$ 1.5K │ 70     │ 1       │ -25%       │
└──────────────┴─────────┴────────┴─────────┴────────────┘
```

## 8. INTEGRAÇÃO COM OUTRAS FERRAMENTAS

### Google Sheets (Automação)

**Use APIs do Meta para:**
- Atualizar planilha automaticamente
- Criar dashboards em tempo real
- Compartilhar com equipe

### Data Studio / Looker Studio

**Conecte o Meta Ads para:**
- Visualizações interativas
- Comparação com outras fontes
- Relatórios automatizados

## CONCLUSÃO

Com estes eventos configurados, você tem visibilidade completa do funil:

**Antes:**
- Só via "Leads" genéricos

**Agora:**
- Lead gerado
- Reunião agendada
- No-show identificado
- Venda fechada com valor

**Resultado:**
- Otimização precisa de campanhas
- ROI mensurável
- Decisões baseadas em dados reais
