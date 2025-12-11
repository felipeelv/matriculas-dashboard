# Configurar Supabase para Persistência de Dados

## Passo 1: Criar conta no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

## Passo 2: Criar a tabela no banco de dados
No painel do Supabase, vá em **SQL Editor** e execute:

```sql
CREATE TABLE matriculas (
  id SERIAL PRIMARY KEY,
  serie VARCHAR(50) NOT NULL UNIQUE,
  total_2025 INTEGER DEFAULT 0,
  total_2026 INTEGER DEFAULT 0,
  meta INTEGER DEFAULT 0,
  gap INTEGER DEFAULT 0,
  percentual DECIMAL(5,2) DEFAULT 0
);

-- Habilitar acesso público (para este dashboard simples)
ALTER TABLE matriculas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura publica" ON matriculas
  FOR SELECT USING (true);

CREATE POLICY "Permitir atualizacao publica" ON matriculas
  FOR UPDATE USING (true);

CREATE POLICY "Permitir insercao publica" ON matriculas
  FOR INSERT WITH CHECK (true);
```

## Passo 3: Obter as credenciais
1. No Supabase, vá em **Settings > API**
2. Copie:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public** key

## Passo 4: Configurar variáveis de ambiente

### Para desenvolvimento local:
Crie um arquivo `.env` na raiz do projeto:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### Para Vercel (produção):
1. No painel do Vercel, vá em **Settings > Environment Variables**
2. Adicione:
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua chave anon

## Pronto!
Após configurar, o dashboard irá:
- Salvar dados automaticamente no Supabase
- Sincronizar entre dispositivos
- Mostrar "☁️ Sincronizado" no header quando conectado
- Funcionar offline com localStorage como fallback
