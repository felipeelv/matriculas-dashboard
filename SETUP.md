# Configurar Neon Database para Persistência de Dados

## Passo 1: Criar conta no Neon
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita (pode usar GitHub)
3. Crie um novo projeto

## Passo 2: Criar a tabela
No painel do Neon, vá em **SQL Editor** e execute:

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

-- Inserir dados iniciais
INSERT INTO matriculas (serie, total_2025, total_2026, meta, gap, percentual) VALUES
('INFANTIL 4', 0, 8, 40, 32, 20.0),
('INFANTIL 5', 0, 17, 40, 23, 42.5),
('1° ANO', 50, 19, 48, 29, 39.6),
('2° ANO', 46, 39, 48, 9, 81.2),
('3° ANO', 51, 29, 48, 19, 60.4),
('4° ANO', 57, 31, 48, 17, 64.6),
('5° ANO', 56, 34, 48, 14, 70.8),
('6° ANO', 51, 35, 48, 13, 72.9),
('7° ANO', 46, 34, 48, 14, 70.8),
('8° ANO', 38, 29, 48, 19, 60.4),
('9° ANO', 54, 26, 48, 22, 54.2),
('1° SÉRIE', 49, 30, 48, 18, 62.5),
('2° SÉRIE', 0, 20, 48, 28, 41.7),
('3° SÉRIE', 0, 1, 48, 47, 2.1);
```

## Passo 3: Obter a Connection String
1. No painel do Neon, vá em **Dashboard**
2. Copie a **Connection String** (começa com `postgresql://...`)

## Passo 4: Configurar no Vercel
1. Vá no seu projeto no Vercel → **Settings** → **Environment Variables**
2. Adicione:
   - **Name**: `DATABASE_URL`
   - **Value**: `sua_connection_string_do_neon`

## Passo 5: Fazer Redeploy
Faça um novo deploy para aplicar as mudanças.

## Pronto!
O dashboard vai:
- Carregar dados do Neon automaticamente
- Salvar alterações no banco
- Mostrar "☁️ Sincronizado" quando conectado
