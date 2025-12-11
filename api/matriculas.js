import { get } from '@vercel/edge-config';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // GET - Ler dados do Edge Config
  if (request.method === 'GET') {
    try {
      const matriculas = await get('matriculas');

      if (matriculas) {
        return new Response(JSON.stringify({ success: true, data: matriculas }), { headers });
      }

      return new Response(JSON.stringify({ success: false, error: 'Dados não encontrados' }), {
        status: 404,
        headers
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers
      });
    }
  }

  // POST - Salvar dados no Edge Config
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { matriculas } = body;

      if (!matriculas) {
        return new Response(JSON.stringify({ success: false, error: 'Dados não fornecidos' }), {
          status: 400,
          headers
        });
      }

      // Atualiza via API do Vercel
      const edgeConfigId = process.env.EDGE_CONFIG_ID || 'ecfg_glzzkqkpq02lpcrregbioiv2d2ir';
      const vercelToken = process.env.VERCEL_API_TOKEN;

      if (!vercelToken) {
        // Sem token, retorna sucesso mas avisa que não salvou na nuvem
        return new Response(JSON.stringify({
          success: true,
          warning: 'VERCEL_API_TOKEN não configurado - dados salvos apenas localmente'
        }), { headers });
      }

      const updateResponse = await fetch(
        `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${vercelToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [
              {
                operation: 'upsert',
                key: 'matriculas',
                value: matriculas,
              },
            ],
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.text();
        throw new Error(`Erro ao atualizar: ${errorData}`);
      }

      return new Response(JSON.stringify({ success: true }), { headers });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Método não permitido' }), {
    status: 405,
    headers
  });
}
