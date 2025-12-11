# Configurar Vercel Edge Config para Persistência de Dados

## Você já tem o Edge Config!
Seus dados do Edge Config:
- **ID**: `ecfg_glzzkqkpq02lpcrregbioiv2d2ir`
- **Connection String**: `https://edge-config.vercel.com/ecfg_glzzkqkpq02lpcrregbioiv2d2ir?token=1bea55b3-7ada-4f60-a21f-279db4f6d46d`

## Passo 1: Criar um Token da API Vercel
1. Acesse [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Clique em "Create Token"
3. Dê um nome (ex: "matriculas-dashboard")
4. Copie o token gerado

## Passo 2: Configurar Variáveis de Ambiente no Vercel
No painel do seu projeto no Vercel, vá em **Settings > Environment Variables** e adicione:

| Nome | Valor |
|------|-------|
| `EDGE_CONFIG` | `https://edge-config.vercel.com/ecfg_glzzkqkpq02lpcrregbioiv2d2ir?token=1bea55b3-7ada-4f60-a21f-279db4f6d46d` |
| `EDGE_CONFIG_ID` | `ecfg_glzzkqkpq02lpcrregbioiv2d2ir` |
| `VERCEL_API_TOKEN` | `seu_token_criado_no_passo_1` |

## Passo 3: Inicializar os Dados (apenas primeira vez)
Após configurar, acesse o Edge Config no painel Vercel e adicione um item:
- **Key**: `matriculas`
- **Value**: (cole o conteúdo do arquivo `src/data.json`)

Ou deixe o app criar automaticamente na primeira vez que você salvar dados.

## Passo 4: Fazer Deploy
Faça um novo deploy para aplicar as variáveis:
```bash
git push
```

## Pronto!
Após configurar, o dashboard irá:
- Carregar dados do Edge Config automaticamente
- Salvar alterações na nuvem
- Mostrar "☁️ Sincronizado" quando conectado
- Funcionar offline com localStorage como fallback

## Troubleshooting
- Se aparecer "💾 Local", verifique se as variáveis de ambiente estão configuradas
- O Edge Config só funciona em produção (no Vercel), localmente usa localStorage
