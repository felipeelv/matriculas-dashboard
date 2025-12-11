// URL base da API
const API_URL = import.meta.env.PROD ? '/api/matriculas' : 'http://localhost:3000/api/matriculas';

// Verifica se Edge Config está disponível
export const isEdgeConfigured = () => {
  return import.meta.env.PROD; // Só funciona em produção no Vercel
};

// Busca dados do Edge Config
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

// Salva dados no Edge Config
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
