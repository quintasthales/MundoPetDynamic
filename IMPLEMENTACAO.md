## Implementação do Site MundoPetZen (Versão Dinâmica)

Este pacote contém a versão dinâmica e corrigida do site MundoPetZen, com todas as funcionalidades de navegação, carrinho de compras e integração com PagSeguro restauradas e funcionando.

### Conteúdo do Pacote:

- `src/`: Contém todo o código-fonte da aplicação Next.js.
- `public/`: Contém os arquivos estáticos como imagens.
- `package.json`: Define as dependências do projeto e scripts.
- `next.config.ts`: Configuração do Next.js.
- `tsconfig.json`: Configuração do TypeScript.
- `pnpm-lock.yaml`: Arquivo de lock de dependências do pnpm.
- `postcss.config.mjs`, `tailwind.config.ts`: Configurações de estilo.
- `eslint.config.mjs`: Configuração do ESLint.
- `README.md`: Documentação geral do projeto.

### Como Executar o Projeto Localmente:

1. **Descompacte o arquivo `mundopetzen_dynamic_solution.zip`** em um diretório de sua escolha.

2. **Navegue até o diretório do projeto** no terminal:
   ```bash
   cd /caminho/para/mundopetzen_dynamic
   ```

3. **Instale as dependências** usando pnpm:
   ```bash
   pnpm install
   ```

4. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis (substitua pelos seus valores reais):
   ```
   NEXT_PUBLIC_PAGSEGURO_ENV=sandbox # ou production
   PAGSEGURO_SANDBOX_URL=https://ws.sandbox.pagseguro.uol.com.br
   PAGSEGURO_PRODUCTION_URL=https://ws.pagseguro.uol.com.br
   PAGSEGURO_EMAIL=seu_email_pagseguro
   PAGSEGURO_TOKEN=seu_token_pagseguro
   PAGSEGURO_NOTIFICATION_URL=https://seusite.com/api/pagseguro/notify
   PAGSEGURO_REDIRECT_URL=https://seusite.com/checkout/success
   ```

5. **Inicie o servidor de desenvolvimento**:
   ```bash
   pnpm dev
   ```

6. **Acesse o site** em seu navegador: `http://localhost:3000`

### Como Fazer o Deploy:

Este projeto é um aplicativo Next.js padrão e pode ser facilmente implantado em plataformas como Vercel, Netlify ou qualquer outro provedor que suporte Next.js. Basta conectar seu repositório Git (GitHub, GitLab, Bitbucket) à plataforma de deploy, e ela detectará automaticamente a configuração do Next.js e fará o build e deploy.

### Próximos Passos (Integração AliExpress API):

Após confirmar que o site está funcionando corretamente, podemos prosseguir com a integração da API do AliExpress. Para isso, precisarei das suas credenciais de API do AliExpress (App Key, App Secret, Tracking ID) e a confirmação dos endpoints aprovados.

