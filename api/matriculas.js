import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return new Response(JSON.stringify({
      success: false,
      error: 'DATABASE_URL não configurado'
    }), { status: 500, headers });
  }

  const sql = neon(databaseUrl);

  // GET - Buscar todas as matrículas
  if (request.method === 'GET') {
    try {
      const rows = await sql`SELECT * FROM matriculas ORDER BY id`;

      if (rows && rows.length > 0) {
        return new Response(JSON.stringify({ success: true, data: rows }), { headers });
      }

      return new Response(JSON.stringify({ success: false, error: 'Sem dados' }), {
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

  // POST - Atualizar matrículas
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { matriculas } = body;

      if (!matriculas || !Array.isArray(matriculas)) {
        return new Response(JSON.stringify({ success: false, error: 'Dados inválidos' }), {
          status: 400,
          headers
        });
      }

      // Atualiza cada registro
      for (const item of matriculas) {
        await sql`
          UPDATE matriculas
          SET total_2025 = ${item.total_2025},
              total_2026 = ${item.total_2026},
              meta = ${item.meta},
              gap = ${item.gap},
              percentual = ${item.percentual}
          WHERE serie = ${item.serie}
        `;
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
