import React from 'react';

function Dashboard({ dados, total2025, total2026, meta, gap, percentualMeta }) {
  return (
    <div className="dashboard">
      {/* Cards de Resumo */}
      <div className="cards-container">
        <div className="card card-primary">
          <h3>Total 2025</h3>
          <p className="card-value">{total2025}</p>
        </div>
        <div className="card card-success">
          <h3>Total 2026</h3>
          <p className="card-value">{total2026}</p>
        </div>
        <div className="card card-warning">
          <h3>Meta</h3>
          <p className="card-value">{meta}</p>
        </div>
        <div className="card card-danger">
          <h3>Gap</h3>
          <p className="card-value">{gap}</p>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="progress-section">
        <h3>Progresso da Meta: {percentualMeta}%</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(percentualMeta, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="table-section">
        <h3>Detalhamento por Série</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Série</th>
              <th>Total 2025</th>
              <th>Total 2026</th>
              <th>Meta</th>
              <th>Gap</th>
              <th>% Atingido</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => (
              <tr key={index} className={item.gap <= 0 ? 'row-success' : ''}>
                <td>{item.serie}</td>
                <td>{item.total_2025}</td>
                <td>{item.total_2026}</td>
                <td>{item.meta}</td>
                <td className={item.gap <= 0 ? 'text-success' : 'text-danger'}>
                  {item.gap}
                </td>
                <td>
                  <span className={`badge ${item.percentual >= 100 ? 'badge-success' : item.percentual >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                    {item.percentual}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
