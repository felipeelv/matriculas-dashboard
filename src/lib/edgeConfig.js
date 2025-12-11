// URL base da API
const API_URL = import.meta.env.PROD ? '/api/matriculas' : 'http://localhost:3000/api/matriculas';

// Verifica se está em produção (Vercel)
export const isCloudConfigured = () => {
  return import.meta.env.PROD;
};

// Alias para manter compatibilidade
export const isEdgeConfigured = isCloudConfigured;

// Busca dados do banco
export const fetchMatriculas = async () => {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.success && result.data) {
      return { data: result.data, error: null };
    }

    return { data: null, error: result.error || 'Dados não encontrados' };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Salva dados no banco
export const saveMatriculas = async (matriculas) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matriculas }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, error: null };
    }

    return { success: false, error: result.error };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
