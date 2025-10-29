# CHECKLIST DE HOMOLOGAÇÃO - META CAPI PRODUÇÃO

## PRÉ-REQUISITOS

### 1. Configuração do Ambiente

- [ ] Arquivo `.env` configurado corretamente
- [ ] `META_PIXEL_ID` = 609508655369916
- [ ] `META_ACCESS_TOKEN` válido e com permissões corretas
- [ ] `PIPERUN_PRIVATE_TOKEN` configurado
- [ ] `NODE_ENV` = production
- [ ] `ENABLE_TEST_MODE` = false (para produção) ou true (para teste)

### 2. Servidor

- [ ] Node.js versão 14+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor acessível na URL configurada
- [ ] HTTPS configurado (obrigatório para produção)
- [ ] Firewall liberado para requisições do Piperun

## FASE 1: TESTES EM MODO TEST

### 3. Validação Básica

- [ ] Servidor inicia sem erros: `node app-production.js`
- [ ] Endpoint `/` responde: retorna JSON com status
- [ ] Endpoint `/health` responde: status healthy
- [ ] Logs aparecem no console formatados em JSON

### 4. Teste com Script de Validação

Execute: `node validate-events.js`

- [ ] Evento `Reuniao_Agendada` enviado com sucesso
- [ ] Evento `No_Show` enviado com sucesso
- [ ] Evento `Venda` enviado com sucesso (com valor)
- [ ] Todos retornam `fbtrace_id`
- [ ] Processing time < 3000ms

### 5. Verificação no Meta Events Manager

Acesse: https://business.facebook.com/events_manager2

- [ ] Selecionar Pixel 609508655369916
- [ ] Ir em "Eventos de Teste"
- [ ] Ver eventos com marcação verde (TEST82947)
- [ ] Verificar que aparecem 3 eventos diferentes
- [ ] Taxa de correspondência (Match Rate) > 70%

### 6. Teste com Piperun (Modo Teste)

- [ ] Criar oportunidade de teste no Piperun
- [ ] Mover para etapa "Agendamento"
- [ ] Verificar logs do servidor
- [ ] Confirmar `email extraido` e `telefone extraido` não vazios
- [ ] Confirmar evento enviado com sucesso
- [ ] Verificar evento aparece no Meta Events Manager

- [ ] Mover para etapa "No-show"
- [ ] Confirmar evento `No_Show` disparado
- [ ] Verificar no Meta Events Manager

- [ ] Marcar como "Ganho" com valor R$ 10.000
- [ ] Confirmar evento `Venda` com valor
- [ ] Verificar no Meta Events Manager
- [ ] Confirmar valor aparece em BRL

## FASE 2: PREPARAÇÃO PARA PRODUÇÃO

### 7. Revisão de Código

- [ ] Código `app-production.js` revisado
- [ ] Sistema de retry implementado (MAX_RETRIES = 3)
- [ ] Logs estruturados em JSON
- [ ] External ID usando ID da oportunidade
- [ ] Hash SHA256 para email e telefone
- [ ] IP e User Agent capturados
- [ ] Suporte a fbc/fbp implementado

### 8. Configuração de Produção

- [ ] Fazer backup do `.env` atual
- [ ] Atualizar `.env`:
  ```
  NODE_ENV=production
  ENABLE_TEST_MODE=false
  ```
- [ ] Remover ou comentar `META_TEST_CODE`
- [ ] Verificar que `META_ACCESS_TOKEN` tem permissões de produção

### 9. Deploy

- [ ] Código commitado no Git
- [ ] Push para repositório
- [ ] Deploy no Render/cPanel executado
- [ ] Servidor reiniciado
- [ ] Verificar logs de inicialização
- [ ] Confirmar `environment: production` nos logs

## FASE 3: VALIDAÇÃO EM PRODUÇÃO

### 10. Primeiro Evento Real

- [ ] Criar oportunidade REAL no Piperun
- [ ] Mover para "Agendamento"
- [ ] Verificar logs do servidor
- [ ] Confirmar `is_production: true` na resposta
- [ ] Verificar evento no Meta Events Manager (aba "Visão Geral", não "Eventos de Teste")

### 11. Verificação no Meta Ads Manager

Aguardar 15-30 minutos após primeiro evento

- [ ] Acessar: https://business.facebook.com/adsmanager
- [ ] Ir em Campanhas
- [ ] Colunas → Personalizar Colunas
- [ ] Adicionar: Reuniao_Agendada, No_Show, Venda
- [ ] Verificar se colunas aparecem (podem estar zeradas ainda)

### 12. Teste do Funil Completo

Usar oportunidade real:

- [ ] Lead entra → Evento registrado
- [ ] Move para Agendamento → `Reuniao_Agendada` aparece
- [ ] Move para No-show → `No_Show` aparece
- [ ] Marca como Ganho (R$ 15.000) → `Venda` aparece com valor

Aguardar 24-48h para métricas estabilizarem

### 13. Validação de Métricas (após 48h)

- [ ] Eventos aparecem no Gerenciador de Eventos
- [ ] Total de eventos condiz com movimentações no Piperun
- [ ] Taxa de correspondência > 70%
- [ ] Valores das vendas corretos
- [ ] Colunas no Ads Manager mostram números
- [ ] É possível criar campanha otimizada para "Venda"

## FASE 4: MONITORAMENTO

### 14. Monitoramento Diário (Primeira Semana)

- [ ] Dia 1: Verificar eventos chegando
- [ ] Dia 2: Conferir taxa de correspondência
- [ ] Dia 3: Validar valores das vendas
- [ ] Dia 4: Verificar métricas nas campanhas
- [ ] Dia 5: Testar otimização de campanha
- [ ] Dia 6: Analisar custo por conversão
- [ ] Dia 7: Relatório semanal de performance

### 15. Configuração de Alertas

- [ ] Configurar alerta se eventos param de chegar
- [ ] Configurar alerta se taxa de correspondência < 60%
- [ ] Configurar alerta se erro rate > 5%
- [ ] Configurar backup do Render para cPanel

## FASE 5: OTIMIZAÇÃO

### 16. Campanhas

- [ ] Criar campanha otimizada para "Venda"
- [ ] Criar campanha otimizada para "Reuniao_Agendada"
- [ ] Testar públicos diferentes
- [ ] Analisar custos por evento

### 17. Públicos Personalizados

- [ ] Criar público de quem agendou reunião
- [ ] Criar público de quem deu no-show (remarketing)
- [ ] Criar público de compradores (lookalike)
- [ ] Excluir compradores de campanhas de topo de funil

### 18. Relatórios

- [ ] Configurar relatório personalizado com todas métricas
- [ ] Exportar para Excel semanalmente
- [ ] Compartilhar com equipe
- [ ] Definir KPIs e metas

## ROLLBACK (EM CASO DE PROBLEMA)

### Procedimento de Emergência

Se algo der errado:

1. [ ] Voltar para modo teste:
   ```
   ENABLE_TEST_MODE=true
   META_TEST_CODE=TEST82947
   ```

2. [ ] Reiniciar servidor

3. [ ] Verificar logs de erro

4. [ ] Testar com script de validação

5. [ ] Identificar problema

6. [ ] Corrigir

7. [ ] Repetir checklist desde FASE 1

## CONTATOS E SUPORTE

### Documentação

- [ ] GUIA_METRICAS_ADS_MANAGER.md lido
- [ ] INSTRUCOES_LUANA_EVENTOS_META.md atualizado
- [ ] README.md com instruções de manutenção

### Suporte Meta

- Meta Business Help: https://business.facebook.com/help
- API Documentation: https://developers.facebook.com/docs/marketing-api

### Suporte Técnico

- Gabriel (Desenvolvedor): [contato]
- Piperun Suporte: [contato]

## ASSINATURAS

### Responsáveis

- [ ] Desenvolvedor: ______________ Data: ____/____/____
- [ ] Cliente (Luana): _____________ Data: ____/____/____
- [ ] Gestor de Tráfego: ___________ Data: ____/____/____

## STATUS FINAL

- [ ] ✅ Sistema 100% funcional em produção
- [ ] ✅ Métricas aparecendo corretamente
- [ ] ✅ Equipe treinada para usar as métricas
- [ ] ✅ Documentação completa entregue
- [ ] ✅ Projeto finalizado e homologado

---

**Data de Homologação**: ____/____/____

**Próxima Revisão**: ____/____/____ (sugestão: 30 dias)
