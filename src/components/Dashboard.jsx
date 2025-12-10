import React from 'react';

function Dashboard({ dados, total2025, total2026, meta, gap, percentualMeta }) {
  // Calcula a variacao percentual
  const variacao = total2025 > 0 ? (((total2026 - total2025) / total2025) * 100).toFixed(1) : 0;

  // Determina o status baseado no percentual
  const getStatusClass = (percentual) => {
    if (percentual >= 100) return 'excellent';
    if (percentual >= 75) return 'good';
    if (percentual >= 50) return 'warning';
    if (percentual >= 25) return 'danger';
    return 'critical';
  };

  const getStatusLabel = (percentual) => {
    if (percentual >= 100) return 'Meta Atingida';
    if (percentual >= 75) return 'Bom';
    if (percentual >= 50) return 'Atenção';
    if (percentual >= 25) return 'Alerta';
    return 'Crítico';
  };

  // Identifica se é ensino fundamental ou médio
  const getSerieType = (serie) => {
    if (serie.includes('SÉRIE')) return 'medio';
    return 'fundamental';
  };

  return (
    <div className="dashboard">
      {/* Cards de Metricas */}
      <div className="cards-container">
        <div className="metric-card primary">
          <div className="metric-card-header">
            <span className="metric-card-title">Total 2025</span>
            <div className="metric-card-icon">📚</div>
          </div>
          <div className="metric-card-value">{total2025}</div>
          <div className="metric-card-subtitle">
            Matrículas ano anterior
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-card-header">
            <span className="metric-card-title">Total 2026</span>
            <div className="metric-card-icon">🎯</div>
          </div>
          <div className="metric-card-value">{total2026}</div>
          <div className="metric-card-subtitle">
            <span className={`metric-card-trend ${variacao >= 0 ? 'up' : 'down'}`}>
              {variacao >= 0 ? '↑' : '↓'} {Math.abs(variacao)}%
            </span>
            vs ano anterior
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-card-header">
            <span className="metric-card-title">Meta</span>
            <div className="metric-card-icon">🏆</div>
          </div>
          <div className="metric-card-value">{meta}</div>
          <div className="metric-card-subtitle">
            Objetivo de matrículas
          </div>
        </div>

        <div className="metric-card danger">
          <div className="metric-card-header">
            <span className="metric-card-title">Gap</span>
            <div className="metric-card-icon">📊</div>
          </div>
          <div className="metric-card-value">{gap}</div>
          <div className="metric-card-subtitle">
            Matrículas restantes
          </div>
        </div>
      </div>

      {/* Barra de Progresso Geral */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-title">Progresso Geral da Meta</span>
          <span className="progress-percentage">{percentualMeta}%</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(percentualMeta, 100)}%` }}
          >
            <span className="progress-bar-text">{total2026} / {meta}</span>
          </div>
        </div>
        <div className="progress-labels">
          <span>0</span>
          <span>Meta: {meta} matrículas</span>
        </div>
      </div>

      {/* Tabela de Dados por Serie */}
      <div className="table-section">
        <div className="table-header">
          <div>
            <h3 className="table-title">Detalhamento por Série</h3>
            <p className="table-subtitle">{dados.length} séries monitoradas</p>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Série</th>
                <th>2025</th>
                <th>2026</th>
                <th>Meta</th>
                <th>Gap</th>
                <th>Progresso</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item, index) => {
                const statusClass = getStatusClass(item.percentual);
                const statusLabel = getStatusLabel(item.percentual);
                const serieType = getSerieType(item.serie);

                return (
                  <tr key={index} className={item.gap <= 0 ? 'row-success' : ''}>
                    <td>
                      <div className="serie-name">
                        <span className={`serie-badge ${serieType}`}></span>
                        {item.serie}
                      </div>
                    </td>
                    <td className="value-cell">{item.total_2025}</td>
                    <td className="value-cell">{item.total_2026}</td>
                    <td className="value-cell">{item.meta}</td>
                    <td className={`value-cell ${item.gap <= 0 ? 'value-positive' : 'value-negative'}`}>
                      {item.gap <= 0 ? item.gap : `+${item.gap}`}
                    </td>
                    <td>
                      <div className="mini-progress">
                        <div className="mini-progress-bar">
                          <div
                            className={`mini-progress-fill ${statusClass}`}
                            style={{ width: `${Math.min(item.percentual, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`mini-progress-value ${item.percentual >= 100 ? 'value-positive' : ''}`}>
                          {item.percentual}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${statusClass}`}>
                        <span className="status-dot"></span>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
