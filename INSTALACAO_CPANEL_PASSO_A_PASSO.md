# INSTALAÇÃO NO CPANEL - PASSO A PASSO

## ARQUIVOS NECESSÁRIOS

Você precisa fazer upload destes arquivos para o servidor:

1. **app.js** - Código principal do webhook
2. **passenger_wsgi.js** - Configuração para cPanel
3. **package.json** - Dependências do Node.js
4. **.env** - Configurações (renomeie .env-cpanel para .env)

## PASSO 1 - CRIAR PASTA NO CPANEL

1. Acesse o cPanel da Luana
2. Va em File Manager
3. Crie uma pasta: **webhook-piperun**
4. Entre na pasta

## PASSO 2 - UPLOAD DOS ARQUIVOS

Faça upload dos 4 arquivos na pasta webhook-piperun:
- app.js
- passenger_wsgi.js
- package.json
- .env (renomeie de .env-cpanel)

## PASSO 3 - EDITAR O ARQUIVO .env

**MUITO IMPORTANTE**: Edite o arquivo .env e coloque o token real da Luana:

```
META_ACCESS_TOKEN=EAAxxxxxx (token real dela)
```

## PASSO 4 - CONFIGURAR NODE.JS NO CPANEL

1. Acesse: **Setup Node.js App** no cPanel
2. Clique em: **Create Application**
3. Preencha:
   - **Node.js version**: 16.x ou superior
   - **Application mode**: Production
   - **Application root**: webhook-piperun
   - **Application URL**: webhook (ou nome que quiser)
   - **Application startup file**: passenger_wsgi.js

4. Clique em **Create**

## PASSO 5 - INSTALAR DEPENDÊNCIAS

Na tela do Node.js App:
1. Clique em **Run NPM Install**
2. Aguarde instalar

## PASSO 6 - TESTAR

Acesse a URL: **https://consori.com.br/webhook/webhook/piperun**

Deve retornar:
```json
{
  "message": "Webhook Piperun to Meta Ads",
  "status": "active",
  "webhook_url": "/webhook/piperun"
}
```

## PASSO 7 - ATUALIZAR PIPERUN

Edite as 3 automações no Piperun da Luana:

**URL antiga**: https://webhook-piperun-luana.onrender.com/webhook/piperun
**URL nova**: https://consori.com.br/webhook/webhook/piperun

## PRONTO!

Agora ela tem controle total do sistema no servidor dela!

## EM CASO DE PROBLEMAS

1. Verifique se o Node.js está habilitado no cPanel
2. Confira se o arquivo .env tem o token correto
3. Teste a URL no navegador
4. Verifique os logs no cPanel

## MANUTENÇÃO

Para fazer alterações:
1. Edite o arquivo app.js pelo File Manager
2. Reinicie a aplicação Node.js
3. Teste novamente

Simples assim! 🚀