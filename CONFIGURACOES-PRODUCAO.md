
# ⚙️ Configurações para Funcionamento 100%

## **🔐 Variáveis de Ambiente Obrigatórias**

### No arquivo .env (desenvolvimento):
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...sua_chave_aqui
```

### No Hostinger (se suportar):
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...sua_chave_aqui
```

## **🗄️ Schema do Banco (Supabase)**

### Tabelas necessárias:
```sql
-- Já está em supabase/migrations/001_initial_schema.sql
-- Será criado automaticamente com: supabase db push
```

## **🔧 Edge Functions (APIs)**

### Função de redirecionamento:
- **Arquivo:** `supabase/functions/redirect/index.ts`
- **Deploy:** `supabase functions deploy redirect`
- **URL:** `https://seu-projeto.supabase.co/functions/v1/redirect`

## **🛡️ Políticas de Segurança (RLS)**

### Configurar no Supabase Dashboard:

1. **Tabela users:**
   ```sql
   -- Usuários podem ver apenas seus próprios dados
   CREATE POLICY "Users can view own data" ON users
   FOR SELECT USING (auth.uid()::text = id);
   ```

2. **Tabela phone_numbers:**
   ```sql
   -- Usuários podem gerenciar apenas seus números
   CREATE POLICY "Users manage own phone numbers" ON phone_numbers
   FOR ALL USING (auth.uid()::text = user_id);
   ```

3. **Tabela clicks:**
   ```sql
   -- Usuários podem ver apenas seus cliques
   CREATE POLICY "Users view own clicks" ON clicks
   FOR SELECT USING (auth.uid()::text = user_id);
   ```

## **🌐 Configurações de Domínio**

### No Supabase:
1. **Settings** > **API** > **Site URL:**
   ```
   https://seudominio.com
   ```

2. **Settings** > **Auth** > **Redirect URLs:**
   ```
   https://seudominio.com
   https://seudominio.com/dashboard
   ```

## **📁 Arquivo .htaccess (Hostinger)**

```apache
# Rewrite rules for React Router
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options SAMEORIGIN
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## **🧪 Checklist de Teste**

### Funcionalidades a testar:

- ✅ **Login/Cadastro**
  - Criar conta nova
  - Fazer login
  - Fazer logout

- ✅ **Gerenciamento de Números**
  - Adicionar número
  - Editar número
  - Ativar/desativar
  - Reordenar

- ✅ **Geração de Links**
  - Link principal funcionando
  - Redirecionamento correto
  - Balanceamento entre números

- ✅ **Estatísticas**
  - Contagem de cliques
  - Localização dos cliques
  - Gráficos funcionando

- ✅ **Responsividade**
  - Desktop
  - Tablet
  - Mobile

## **🔍 Monitoramento**

### Logs importantes:

1. **Console do navegador** (F12)
2. **Supabase Dashboard** > Logs
3. **Hostinger hPanel** > Logs de Erro

### Métricas a acompanhar:

- **Uptime** da aplicação
- **Tempo de resposta** dos redirecionamentos
- **Erros** nas Edge Functions
- **Performance** do banco de dados

## **🚨 Troubleshooting Rápido**

### Site não carrega:
1. Verificar se build foi feito corretamente
2. Verificar arquivo .htaccess
3. Verificar logs do Hostinger

### Login não funciona:
1. Verificar variáveis de ambiente
2. Verificar URL de redirect no Supabase
3. Verificar políticas RLS

### Links não redirecionam:
1. Verificar se Edge Function foi deployada
2. Verificar logs da função no Supabase
3. Verificar configuração de CORS

### Estatísticas não aparecem:
1. Verificar políticas RLS
2. Verificar conexão com banco
3. Verificar se há dados de teste

---

**✅ Com essas configurações, sua aplicação funcionará 100%!**
