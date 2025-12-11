import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import './styles/App.css';
import dadosIniciais from './data.json';
import { fetchMatriculas, saveMatriculas, isEdgeConfigured } from './lib/edgeConfig';

// Chave para localStorage
const STORAGE_KEY = 'matriculas-dashboard-data';

// Constantes de turmas
const ALUNOS_POR_TURMA_INFANTIL = 20;
const ALUNOS_POR_TURMA_FUNDAMENTAL = 24;
const ALUNOS_POR_TURMA_MEDIO = 48;
const TURMAS_POR_SERIE_INFANTIL = 2; // 2 turmas por serie no infantil
const TURMAS_POR_SERIE_FUNDAMENTAL = 2; // 2 turmas por serie no fundamental
const TURMAS_POR_SERIE_MEDIO = 1; // 1 turma por serie no medio

// Meta calculada automaticamente
// Infantil: 2 series x 2 turmas x 20 alunos = 80
// Fundamental: 9 series x 2 turmas x 24 alunos = 432
// Medio: 3 series x 1 turma x 48 alunos = 144
// Total: 656
const META_INFANTIL = 2 * TURMAS_POR_SERIE_INFANTIL * ALUNOS_POR_TURMA_INFANTIL; // 80
const META_FUNDAMENTAL = 9 * TURMAS_POR_SERIE_FUNDAMENTAL * ALUNOS_POR_TURMA_FUNDAMENTAL; // 432
const META_MEDIO = 3 * TURMAS_POR_SERIE_MEDIO * ALUNOS_POR_TURMA_MEDIO; // 144
const META_TOTAL = META_INFANTIL + META_FUNDAMENTAL + META_MEDIO; // 656

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [dados, setDados] = useState(dadosIniciais);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [useCloud, setUseCloud] = useState(false);

  // Carrega dados ao iniciar
  useEffect(() => {
    const loadData = async () => {
      // Em produção (Vercel), tenta carregar do Edge Config
      if (isEdgeConfigured()) {
        try {
          const { data, error } = await fetchMatriculas();

          if (data && !error) {
            setDados(data);
            setUseCloud(true);
          } else {
            // Fallback para localStorage
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
              try {
                setDados(JSON.parse(saved));
              } catch {
                setDados(dadosIniciais);
              }
            }
          }
        } catch (err) {
          console.log('Edge Config não disponível, usando localStorage:', err.message);
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            try {
              setDados(JSON.parse(saved));
            } catch {
              setDados(dadosIniciais);
            }
          }
        }
      } else {
        // Desenvolvimento local: usa localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setDados(JSON.parse(saved));
          } catch {
            setDados(dadosIniciais);
          }
        }
      }
      setLoading(false);
    };

    loadData();
  }, []);

  // Salva dados quando mudam
  useEffect(() => {
    if (loading) return;

    const saveData = async () => {
      // Sempre salva no localStorage como backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));

      // Em produção, salva no Edge Config
      if (useCloud && isEdgeConfigured()) {
        setSaving(true);
        try {
          await saveMatriculas(dados);
        } catch (err) {
          console.error('Erro ao salvar no Edge Config:', err);
        }
        setSaving(false);
      }
    };

    saveData();
  }, [dados, loading, useCloud]);

  const total2025 = dados.reduce((acc, curr) => acc + curr.total_2025, 0);
  const total2026 = dados.reduce((acc, curr) => acc + curr.total_2026, 0);
  const meta = META_TOTAL; // Meta calculada automaticamente: 576
  const gap = meta - total2026;
  const percentualMeta = ((total2026 / meta) * 100).toFixed(1);

  const handleUpdateDados = (newDados) => {
    setDados(newDados);
  };

  const handleResetDados = async () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados para o estado inicial?')) {
      setDados(dadosIniciais);
      localStorage.removeItem(STORAGE_KEY);

      // Reset no Edge Config também
      if (useCloud && isEdgeConfigured()) {
        try {
          await saveMatriculas(dadosIniciais);
        } catch (err) {
          console.error('Erro ao resetar no Edge Config:', err);
        }
      }
    }
  };

  // Mostra loading enquanto carrega
  if (loading) {
    return (
      <div className="container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {currentPage === 'dashboard' ? (
        <>
          <header className="header">
            <h1>Dashboard de Matriculas 2026</h1>
            <p>Acompanhamento em Tempo Real do Progresso de Captacao</p>
            <div className="header-actions">
              <span className={`cloud-status ${useCloud ? 'online' : 'offline'}`}>
                {saving ? '⏳ Salvando...' : useCloud ? '☁️ Sincronizado' : '💾 Local'}
              </span>
              <button
                className="header-admin-btn"
                onClick={() => setCurrentPage('admin')}
              >
                Gerenciar Matriculas
              </button>
            </div>
          </header>

          <Dashboard
            dados={dados}
            total2025={total2025}
            total2026={total2026}
            meta={meta}
            gap={gap}
            percentualMeta={percentualMeta}
          />

          <footer className="footer">
            <div className="footer-content">
              <span className="footer-dot"></span>
              <span>Atualizado em: {new Date().toLocaleString('pt-BR')}</span>
            </div>
          </footer>
        </>
      ) : (
        <AdminPanel
          dados={dados}
          onUpdateDados={handleUpdateDados}
          onVoltar={() => setCurrentPage('dashboard')}
          onReset={handleResetDados}
        />
      )}
    </div>
  );
}

export default App;
