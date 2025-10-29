# 🎯 GUIA RÁPIDO - USAR A VERSÃO DE PRODUÇÃO

## 🚀 INÍCIO RÁPIDO

### 1. Substitua o arquivo principal

**Opção A: Renomear (recomendado)**
```bash
mv app.js app-old.js
mv app-production.js app.js
```

**Opção B: Editar package.json**
```json
{
  "main": "app-production.js",
  "scripts": {
    "start": "node app-production.js"
  }
}
```

### 2. Configure o ambiente

```bash
# Copie o template
cp .env.production .env

# Edite o arquivo .env
# IMPORTANTE: Coloque o META_ACCESS_TOKEN real
```

### 3. Para TESTAR primeiro

Em `.env`:
```
ENABLE_TEST_MODE=true
META_TEST_CODE=TEST82947
```

Inicie o servidor:
```bash
node app.js
```

Execute o script de validação:
```bash
node validate-events.js
```

Verifique no Meta:
- Acesse: https://business.facebook.com/events_manager2
- Vá em "Eventos de Teste"
- Veja os 3 eventos com marcação verde

### 4. Para IR PARA PRODUÇÃO

Em `.env`:
```
ENABLE_TEST_MODE=false
# Remova ou comente META_TEST_CODE
```

Reinicie o servidor:
```bash
node app.js
```

Aguarde 24-48h para métricas aparecerem no Ads Manager.

## 📋 CHECKLIST MÍNIMO

Antes de ativar produção:

- [ ] Testou com `ENABLE_TEST_MODE=true`
- [ ] Eventos aparecem no Meta Events Manager
- [ ] Taxa de correspondência > 70%
- [ ] Validou os 3 tipos de evento
- [ ] Luana aprovou os testes

## 📚 DOCUMENTAÇÃO

- `PR_SUMMARY.md` - Resumo completo das mudanças
- `CHECKLIST_HOMOLOGACAO.md` - Checklist detalhado (18 seções)
- `GUIA_METRICAS_ADS_MANAGER.md` - Como ver as métricas
- `validate-events.js` - Script para testar

## ❓ DÚVIDAS?

Leia o `CHECKLIST_HOMOLOGACAO.md` - tem tudo lá!

## 🎉 BOA SORTE!

O sistema está pronto para produção! 🚀
