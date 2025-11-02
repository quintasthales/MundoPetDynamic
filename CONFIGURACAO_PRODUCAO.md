# 🚀 Guia de Configuração para Produção - MundoPetZen

Este guia te ajudará a configurar todas as variáveis de ambiente necessárias para colocar o MundoPetZen em produção.

## 📋 Pré-requisitos

Antes de começar, você precisará criar contas e obter credenciais nos seguintes serviços:

### 1. PagSeguro (Gateway de Pagamento)
- **Site:** https://pagseguro.uol.com.br/
- **Documentação:** https://dev.pagseguro.uol.com.br/
- **O que você precisa:**
  - Email da conta PagSeguro
  - Token de integração
  - Chave pública (para o frontend)

### 2. AliExpress API (Dropshipping) - OPCIONAL
- **Site:** https://developers.aliexpress.com/
- **O que você precisa:**
  - App Key
  - App Secret  
  - Access Token

## 🔧 Configuração Passo a Passo

### Passo 1: Configurar Variáveis de Ambiente

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edite o arquivo `.env.local`** com suas credenciais reais:

#### Configurações Essenciais (OBRIGATÓRIAS):

```env
# URL do seu site
NEXT_PUBLIC_BASE_URL=https://www.mundopetzen.shop

# PagSeguro - PRODUÇÃO
NEXT_PUBLIC_PAGSEGURO_ENV=production
PAGSEGURO_EMAIL=seu-email@pagseguro.com.br
PAGSEGURO_TOKEN=SEU_TOKEN_REAL_AQUI
NEXT_PUBLIC_PAGSEGURO_PUBLIC_KEY=SUA_CHAVE_PUBLICA_REAL
```

#### Configurações Opcionais:

```env
# AliExpress (se você quiser usar dropshipping real)
ALIEXPRESS_APP_KEY=SUA_APP_KEY
ALIEXPRESS_APP_SECRET=SEU_APP_SECRET
ALIEXPRESS_ACCESS_TOKEN=SEU_ACCESS_TOKEN

# Segurança
JWT_SECRET=uma-chave-muito-longa-e-aleatoria-para-seguranca
```

### Passo 2: Obter Credenciais do PagSeguro

#### Para Ambiente de Testes (Sandbox):
1. Acesse: https://sandbox.pagseguro.uol.com.br/
2. Crie uma conta de testes
3. Vá em "Minha Conta" > "Preferências" > "Integrações"
4. Anote o **Email** e **Token**

#### Para Ambiente de Produção:
1. Acesse: https://pagseguro.uol.com.br/
2. Faça login na sua conta real
3. Vá em "Minha Conta" > "Preferências" > "Integrações"
4. Gere um novo **Token de Segurança**
5. Anote o **Email** e **Token**

### Passo 3: Configurar Webhooks (Notificações)

No painel do PagSeguro:
1. Vá em "Preferências" > "Notificações de transação"
2. Configure a URL: `https://www.mundopetzen.shop/api/pagseguro/notify`
3. Marque todas as opções de status de transação

### Passo 4: Testar em Ambiente de Staging

Antes de ir para produção, teste em um ambiente de staging:

```env
# Para testes
NEXT_PUBLIC_PAGSEGURO_ENV=sandbox
NEXT_PUBLIC_BASE_URL=https://seu-site-de-teste.vercel.app
```

### Passo 5: Deploy para Produção

#### Na Vercel:
1. Vá no painel da Vercel
2. Selecione seu projeto
3. Vá em "Settings" > "Environment Variables"
4. Adicione todas as variáveis do seu `.env.local`

#### Variáveis essenciais para adicionar na Vercel:
```
NEXT_PUBLIC_BASE_URL = https://www.mundopetzen.shop
NEXT_PUBLIC_PAGSEGURO_ENV = production
PAGSEGURO_EMAIL = seu-email@pagseguro.com.br
PAGSEGURO_TOKEN = SEU_TOKEN_REAL
NEXT_PUBLIC_PAGSEGURO_PUBLIC_KEY = SUA_CHAVE_PUBLICA
JWT_SECRET = sua-chave-secreta-longa
```

## 🔒 Segurança

### ⚠️ IMPORTANTE - Nunca faça isso:
- ❌ Não commite arquivos `.env.local` no Git
- ❌ Não compartilhe tokens em mensagens ou emails
- ❌ Não use credenciais de produção em ambiente de desenvolvimento

### ✅ Boas práticas:
- ✅ Use credenciais de sandbox para desenvolvimento
- ✅ Use credenciais de produção apenas no servidor final
- ✅ Regenere tokens periodicamente
- ✅ Monitore logs de transações

## 🧪 Como Testar

### Teste em Sandbox:
1. Configure `NEXT_PUBLIC_PAGSEGURO_ENV=sandbox`
2. Use cartões de teste do PagSeguro
3. Verifique se as transações aparecem no painel sandbox

### Teste em Produção:
1. Configure `NEXT_PUBLIC_PAGSEGURO_ENV=production`
2. Faça uma compra real de baixo valor
3. Verifique se a transação aparece no painel real
4. Confirme se os webhooks estão funcionando

## 📞 Suporte

Se você encontrar problemas:

1. **PagSeguro:** https://dev.pagseguro.uol.com.br/docs
2. **Vercel:** https://vercel.com/docs
3. **Next.js:** https://nextjs.org/docs

## 🎯 Checklist Final

Antes de lançar em produção, verifique:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Testes realizados em sandbox
- [ ] Webhooks configurados e testados
- [ ] SSL/HTTPS funcionando
- [ ] Domínio personalizado configurado
- [ ] Backup das credenciais em local seguro
- [ ] Monitoramento de erros configurado (opcional)

---

**🎉 Parabéns! Seu MundoPetZen está pronto para produção!**
