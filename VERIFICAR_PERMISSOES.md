# 🚨 VERIFICAÇÃO NECESSÁRIA - PERMISSÕES META ADS

## ⚠️ **SITUAÇÃO ATUAL:**

O token está válido, mas está dando erro:
```
"Object with ID '6095086553699116' does not exist, cannot be loaded 
due to missing permissions, or does not support this operation"
```

## 🎯 **POSSÍVEIS CAUSAS:**

### 1. **Pixel ID Incorreto ou Inativo**
- Confirmar se o Pixel `6095086553699116` está ativo
- Verificar se é o pixel correto das campanhas

### 2. **Permissões Insuficientes**
- O token precisa de permissões específicas
- Pode não ter acesso ao pixel específico

## 📋 **PEDIR PARA LUANA VERIFICAR:**

```
Luana!

O token chegou, mas preciso que você confirme:

1. O Pixel ID está correto: 6095086553699116?
   (Business Manager → Eventos → Pixels → verificar ID)

2. O System User "api-consori" tem acesso a esse pixel?
   (Business Manager → System Users → api-consori → Assigned Assets)

3. Se possível, gerar o token diretamente pelo pixel:
   Events Manager → Configurações → Conversions API → 
   Generate Access Token

Com essas confirmações, finalizo tudo! 🚀
```

## 🔄 **ALTERNATIVA RÁPIDA:**

Se ela tiver acesso ao **Events Manager**:
1. Acessar o pixel específico
2. Ir em **Conversions API**
3. Clicar em **Generate Access Token**
4. Esse token terá permissões garantidas

---

**🎯 STATUS: 95% completo - só falta ajustar permissões!** 🏆