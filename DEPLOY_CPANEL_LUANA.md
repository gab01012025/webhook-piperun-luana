# COMO INSTALAR NO SERVIDOR CPANEL DA LUANA

## REQUISITOS

O servidor precisa ter:
- Node.js instalado (versao 14 ou superior)
- Acesso SSH ou File Manager do cPanel
- Suporte a aplicacoes Node.js

## PASSO 1 - FAZER UPLOAD DOS ARQUIVOS

Via File Manager do cPanel:

1. Acesse o cPanel
2. Va em File Manager
3. Crie uma pasta: /home/consori/webhook-piperun
4. Faca upload dos seguintes arquivos:
   - app.js
   - passenger_wsgi.js
   - package.json
   - .env

## PASSO 2 - CONFIGURAR O .env

Edite o arquivo .env com os dados corretos:

```
META_PIXEL_ID=609508655369916
META_ACCESS_TOKEN=(token do Meta Ads)
META_TEST_CODE=TEST82947
PIPERUN_PRIVATE_TOKEN=Y2duc29yaTplb25zb3JjQHpcGydWyMDMwlQ
PORT=3000
NODE_ENV=production
ENABLE_TEST_MODE=true
```

## PASSO 3 - INSTALAR DEPENDENCIAS

Via SSH:

```bash
cd /home/consori/webhook-piperun
npm install
```

Ou via cPanel:
1. Va em Setup Node.js App
2. Selecione a pasta webhook-piperun
3. Clique em Run NPM Install

## PASSO 4 - CONFIGURAR APLICACAO NODE.JS NO CPANEL

1. Acesse: cPanel > Setup Node.js App
2. Clique em: Create Application
3. Preencha:
   - Node.js version: 14.x ou superior
   - Application mode: Production
   - Application root: webhook-piperun
   - Application URL: webhook.consori.com.br (ou subdominio desejado)
   - Application startup file: passenger_wsgi.js
   - Environment variables: (copie do arquivo .env)

4. Clique em Create

## PASSO 5 - TESTAR

Acesse: https://webhook.consori.com.br/webhook/piperun

Deve retornar:
```json
{
  "message": "Webhook Piperun to Meta Ads",
  "status": "active",
  "webhook_url": "/webhook/piperun"
}
```

## PASSO 6 - ATUALIZAR PIPERUN

Edite as 3 automacoes no Piperun:

Troque a URL de:
https://webhook-piperun-luana.onrender.com/webhook/piperun

Para:
https://webhook.consori.com.br/webhook/piperun

## VANTAGENS DO CPANEL

- Ela tem controle total
- Pode editar arquivos direto pelo File Manager
- Nao depende do Render
- Pode fazer manutencao quando quiser

## DESVANTAGENS

- Precisa gerenciar atualizacoes manualmente
- Se o servidor cair, precisa reiniciar manualmente
- Nao tem deploy automatico do GitHub

## RECOMENDACAO

Mantenha os dois funcionando:
- Render: Como backup automatico
- cPanel: Para ela ter controle e fazer testes

Se precisar fazer manutencao:
1. Edita no cPanel
2. Testa
3. Se funcionar, atualiza no GitHub
4. Render faz deploy automatico

Assim ela tem redundancia e controle total!
