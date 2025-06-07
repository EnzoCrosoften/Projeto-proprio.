
# 🚀 Guia Completo: Deploy AdvertoLinks no Hostinger

## **PARTE 1: Preparação do Código**

### 1.1 Baixar o Projeto
1. **Conectar ao GitHub:**
   - Clique no botão "GitHub" no canto superior direito do Lovable
   - Autorize a conexão com sua conta GitHub
   - Crie um novo repositório para o projeto

2. **Clonar localmente:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git
   cd seu-repo
   ```

### 1.2 Instalar Dependências
```bash
npm install
```

### 1.3 Configurar Variáveis de Ambiente
1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Configure as variáveis** (você receberá essas informações do Supabase):
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui
   ```

## **PARTE 2: Configuração do Supabase (Backend)**

### 2.1 Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha organização e nome do projeto
4. Aguarde a criação (2-3 minutos)

### 2.2 Executar Migrações do Banco
1. **Instalar Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Fazer login:**
   ```bash
   supabase login
   ```

3. **Conectar ao projeto:**
   ```bash
   supabase link --project-ref SEU_PROJECT_REF
   ```

4. **Executar migrações:**
   ```bash
   supabase db push
   ```

### 2.3 Deploy das Edge Functions
```bash
supabase functions deploy redirect
```

### 2.4 Configurar Políticas de Segurança (RLS)
No painel do Supabase, vá em Authentication > Policies e ative:
- Políticas para tabela `users`
- Políticas para tabela `phone_numbers`  
- Políticas para tabela `clicks`

## **PARTE 3: Build para Produção**

### 3.1 Criar Build de Produção
```bash
npm run build
```

### 3.2 Testar Build Localmente
```bash
npm run preview
```

## **PARTE 4: Deploy no Hostinger**

### 4.1 Preparar Arquivos
1. **Comprimir pasta dist:**
   ```bash
   cd dist
   zip -r advertolinks-build.zip *
   ```

### 4.2 Upload no Hostinger
1. **Acesse o hPanel** do Hostinger
2. **Vá em Gerenciador de Arquivos**
3. **Navegue até public_html** (ou subdomínio)
4. **Faça upload do arquivo zip**
5. **Extraia os arquivos** na pasta raiz

### 4.3 Configurar Redirecionamentos
1. **Crie arquivo .htaccess** na pasta public_html:
   ```apache
   RewriteEngine On
   RewriteBase /
   
   # Handle Angular/React Router
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   
   # Security headers
   Header always set X-Frame-Options SAMEORIGIN
   Header always set X-Content-Type-Options nosniff
   Header always set X-XSS-Protection "1; mode=block"
   ```

## **PARTE 5: Configurações Finais**

### 5.1 Configurar Domínio no Supabase
1. **No painel Supabase** > Settings > API
2. **Adicionar URL do site** em "Site URL":
   ```
   https://seudominio.com
   ```

### 5.2 Testar Funcionamento
- ✅ Login/Logout
- ✅ Cadastro de números
- ✅ Geração de links
- ✅ Redirecionamento
- ✅ Estatísticas de cliques

## **PARTE 6: Monitoramento**

### 6.1 Verificar Logs
- **Supabase:** Dashboard > Logs
- **Hostinger:** hPanel > Logs de Erro

### 6.2 Backup
- **Banco:** Supabase > Settings > Database > Backup
- **Arquivos:** Download regular da pasta public_html

## **🔧 Troubleshooting Comum**

### Erro: "CORS policy"
**Solução:** Adicionar domínio nas configurações do Supabase

### Erro: "404 em rotas"
**Solução:** Verificar arquivo .htaccess

### Erro: "Build failed"
**Solução:** Verificar variáveis de ambiente

### Links não redirecionam
**Solução:** Verificar deploy das Edge Functions

## **📞 Suporte**

Se algum passo não funcionar:
1. Verificar logs do Supabase
2. Testar localmente primeiro
3. Verificar configurações do domínio
4. Contactar suporte do Hostinger se necessário

---

**🎉 Parabéns!** Sua aplicação AdvertoLinks está no ar!
