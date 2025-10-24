# 🚀 Demo: Como Usar o Sistema

## Execução Rápida

### 1. Instalar e Iniciar
```bash
npm install
cp .env.example .env
# Editar .env com suas credenciais
npm start
```

### 2. Testar Sistema
```bash
# Em outro terminal
npm test
```

## 📋 Checklist de Validação

### ✅ Configuração
- [ ] Arquivo `.env` configurado com credenciais válidas
- [ ] Servidor iniciado sem erros
- [ ] Endpoint principal respondendo: http://localhost:3000

### ✅ Conectividade  
- [ ] Meta Ads API acessível
- [ ] Pixel ID válido e ativo
- [ ] Access Token com permissões corretas

### ✅ Processamento
- [ ] Dados do Piperun sendo normalizados
- [ ] Mapeamento de campos funcionando
- [ ] Hash SHA256 aplicado corretamente

### ✅ Integração Meta Ads
- [ ] Eventos sendo enviados com status 200
- [ ] Events Manager recebendo eventos (verde)
- [ ] Event matching funcionando

### ✅ Automação Piperun
- [ ] Webhook configurado na automação
- [ ] Gatilho funcionando na etapa correta
- [ ] Payload JSON válido

## 🧪 Cenários de Teste

### Teste 1: Webhook Manual
```bash
curl -X POST http://localhost:3000/webhook/piperun \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com", 
    "phone": "11999999999",
    "status": "qualified",
    "value": 500
  }'
```

### Teste 2: Via Interface Web
1. Acesse: http://localhost:3000/test-connection
2. Verifique se todas as conexões estão OK
3. Acesse: http://localhost:3000/diagnostic para análise completa

### Teste 3: Events Manager
1. Acesse Meta Events Manager
2. Vá em Test Events (se usando test_event_code)
3. Envie evento de teste pelo sistema
4. Verifique se evento aparece como "Received"

### Teste 4: Piperun Real
1. Configure automação no Piperun
2. Crie oportunidade teste
3. Mova para etapa "Agendamento"
4. Verifique logs do sistema
5. Confirme evento no Meta Events Manager

## 📊 Resultados Esperados

### ✅ Sucesso
```json
{
  "success": true,
  "message": "Evento processado e enviado para Meta Ads",
  "eventId": "abc123...",
  "status": "sent"
}
```

### ❌ Erro Comum
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": ["Email obrigatório não encontrado"]
}
```

## 🎯 Critérios de Aprovação

### Meta Events Manager
- [x] Eventos com status **"Received"** (verde)
- [x] Dados de usuário sendo matched
- [x] Event source: "website"  
- [x] Custom data presente (quando aplicável)

### Logs do Sistema
- [x] Status 200 nas requisições
- [x] Sem erros de processamento
- [x] Dados sendo sanitizados corretamente
- [x] Hash SHA256 aplicado nos campos sensíveis

### Performance
- [x] Resposta em menos de 5 segundos
- [x] Sem timeout nas conexões
- [x] Retry automático em caso de falha temporária

## 🚀 Próximos Passos

### Após Validação
1. **Deploy em Produção**
   - Servidor com SSL/HTTPS
   - Monitoramento 24/7
   - Backup dos logs

2. **Configurar Piperun**
   - URL do servidor de produção
   - Testar com oportunidades reais
   - Configurar alertas de falha

3. **Monitoramento Contínuo**
   - Verificar Events Manager semanalmente
   - Análise de logs mensalmente
   - Otimizações baseadas em dados

## 🆘 Suporte Rápido

### Comandos Úteis
```bash
# Verificar status
curl http://localhost:3000/

# Testar conexões
curl http://localhost:3000/test-connection

# Ver logs
tail -f logs/app-$(date +%Y-%m-%d).log

# Reiniciar servidor
npm restart
```

### Contatos de Emergência
- **Técnico**: Equipe desenvolvimento
- **Funcional**: Luana Ribeiro
- **Meta Ads**: Business Help Center
- **Piperun**: Suporte técnico

---

**💡 Dica**: Mantenha sempre o Events Manager aberto durante os testes para validação em tempo real dos eventos!