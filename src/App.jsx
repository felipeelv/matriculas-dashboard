import React from 'react';
import Dashboard from './components/Dashboard';
import './styles/App.css';
import dados from './data.json';

function App() {
  const total2025 = 541;
  const total2026 = dados.reduce((acc, curr) => acc + curr.total_2026, 0);
  const meta = 600;
  const gap = meta - total2026;
  const percentualMeta = ((total2026 / meta) * 100).toFixed(1);

  return (
    <div className="container">
      <header className="header">
        <h1>📊 Dashboard de Matrículas 2026</h1>
        <p>Acompanhamento em Tempo Real do Progresso de Captação</p>
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
        <p>🔄 Atualizado em: {new Date().toLocaleString('pt-BR')}</p>
      </footer>
    </div>
  );
}

export default App;
