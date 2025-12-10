import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import './styles/App.css';
import dadosIniciais from './data.json';

// Chave para localStorage
const STORAGE_KEY = 'matriculas-dashboard-data';
const META_KEY = 'matriculas-dashboard-meta';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [dados, setDados] = useState(() => {
    // Tenta carregar do localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return dadosIniciais;
      }
    }
    return dadosIniciais;
  });

  const [metaGeral, setMetaGeral] = useState(() => {
    const saved = localStorage.getItem(META_KEY);
    return saved ? parseInt(saved) : 600;
  });

  // Salva no localStorage quando dados mudam
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  }, [dados]);

  useEffect(() => {
    localStorage.setItem(META_KEY, metaGeral.toString());
  }, [metaGeral]);

  const total2025 = dados.reduce((acc, curr) => acc + curr.total_2025, 0);
  const total2026 = dados.reduce((acc, curr) => acc + curr.total_2026, 0);
  const meta = metaGeral;
  const gap = meta - total2026;
  const percentualMeta = ((total2026 / meta) * 100).toFixed(1);

  const handleUpdateDados = (newDados, newMeta) => {
    setDados(newDados);
    if (newMeta) {
      setMetaGeral(newMeta);
    }
  };

  const handleResetDados = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados para o estado inicial?')) {
      setDados(dadosIniciais);
      setMetaGeral(600);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(META_KEY);
    }
  };

  return (
    <div className="container">
      {currentPage === 'dashboard' ? (
        <>
          <header className="header">
            <h1>Dashboard de Matriculas 2026</h1>
            <p>Acompanhamento em Tempo Real do Progresso de Captacao</p>
            <button
              className="header-admin-btn"
              onClick={() => setCurrentPage('admin')}
            >
              Gerenciar Matriculas
            </button>
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
