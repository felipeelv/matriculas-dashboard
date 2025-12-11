import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import './styles/App.css';
import dadosIniciais from './data.json';

// Chave para localStorage
const STORAGE_KEY = 'matriculas-dashboard-data';

// Constantes de turmas
const ALUNOS_POR_TURMA_FUNDAMENTAL = 24;
const ALUNOS_POR_TURMA_MEDIO = 48;
const TURMAS_POR_SERIE_FUNDAMENTAL = 2; // 2 turmas por serie no fundamental
const TURMAS_POR_SERIE_MEDIO = 1; // 1 turma por serie no medio

// Meta calculada automaticamente
// Fundamental: 9 series x 2 turmas x 24 alunos = 432
// Medio: 3 series x 1 turma x 48 alunos = 144
// Total: 576
const META_FUNDAMENTAL = 9 * TURMAS_POR_SERIE_FUNDAMENTAL * ALUNOS_POR_TURMA_FUNDAMENTAL; // 432
const META_MEDIO = 3 * TURMAS_POR_SERIE_MEDIO * ALUNOS_POR_TURMA_MEDIO; // 144
const META_TOTAL = META_FUNDAMENTAL + META_MEDIO; // 576

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

  // Salva no localStorage quando dados mudam
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  }, [dados]);

  const total2025 = dados.reduce((acc, curr) => acc + curr.total_2025, 0);
  const total2026 = dados.reduce((acc, curr) => acc + curr.total_2026, 0);
  const meta = META_TOTAL; // Meta calculada automaticamente: 576
  const gap = meta - total2026;
  const percentualMeta = ((total2026 / meta) * 100).toFixed(1);

  const handleUpdateDados = (newDados) => {
    setDados(newDados);
  };

  const handleResetDados = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados para o estado inicial?')) {
      setDados(dadosIniciais);
      localStorage.removeItem(STORAGE_KEY);
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
