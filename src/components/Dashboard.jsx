import React from 'react';

function Dashboard({ dados, total2025, total2026, meta, gap, percentualMeta }) {
  // Calcula a variacao percentual
  const variacao = total2025 > 0 ? (((total2026 - total2025) / total2025) * 100).toFixed(1) : 0;

  // Constantes de alunos por turma
  const ALUNOS_POR_TURMA_INFANTIL = 20;
  const ALUNOS_POR_TURMA_FUNDAMENTAL = 24;
  const ALUNOS_POR_TURMA_MEDIO = 48;

  // Funcao para calcular informacoes de turma
  const calcularTurmas = (totalAlunos, alunosPorTurma) => {
    const turmasCompletas = Math.floor(totalAlunos / alunosPorTurma);
    const alunosTurmaAtual = totalAlunos % alunosPorTurma;
    const faltamParaCompletar = alunosTurmaAtual > 0 ? alunosPorTurma - alunosTurmaAtual : 0;

    // Gera letra da turma (A, B, C, ...)
    const letraTurmaAtual = String.fromCharCode(65 + turmasCompletas); // 65 = 'A'

    return {
      turmasCompletas,
      turmaAtual: alunosTurmaAtual > 0 ? letraTurmaAtual : (turmasCompletas > 0 ? String.fromCharCode(64 + turmasCompletas) : 'A'),
      alunosTurmaAtual,
      faltamParaCompletar,
      alunosPorTurma
    };
  };

  // Verifica o tipo de segmento
  const isInfantil = (serie) => serie.includes('INFANTIL');
  const isMedio = (serie) => serie.includes('SÉRIE');
  const isFundamental = (serie) => serie.includes('ANO');

  // Retorna alunos por turma baseado no segmento
  const getAlunosPorTurma = (serie) => {
    if (isInfantil(serie)) return ALUNOS_POR_TURMA_INFANTIL;
    if (isMedio(serie)) return ALUNOS_POR_TURMA_MEDIO;
    return ALUNOS_POR_TURMA_FUNDAMENTAL;
  };

  // Separa os dados por segmento
  const infantil = dados
    .filter(item => item.serie.includes('INFANTIL'))
    .sort((a, b) => {
      const numA = parseInt(a.serie.match(/\d+/)[0]);
      const numB = parseInt(b.serie.match(/\d+/)[0]);
      return numA - numB;
    });

  const fundamental = dados
    .filter(item => item.serie.includes('ANO'))
    .sort((a, b) => {
      const numA = parseInt(a.serie.match(/\d+/)[0]);
      const numB = parseInt(b.serie.match(/\d+/)[0]);
      return numA - numB;
    });

  const medio = dados
    .filter(item => item.serie.includes('SÉRIE'))
    .sort((a, b) => {
      const numA = parseInt(a.serie.match(/\d+/)[0]);
      const numB = parseInt(b.serie.match(/\d+/)[0]);
      return numA - numB;
    });

  // Calcula totais por segmento
  const calcularTotais = (segmento) => ({
    total2025: segmento.reduce((acc, curr) => acc + curr.total_2025, 0),
    total2026: segmento.reduce((acc, curr) => acc + curr.total_2026, 0),
    meta: segmento.reduce((acc, curr) => acc + curr.meta, 0),
    gap: segmento.reduce((acc, curr) => acc + curr.gap, 0),
  });

  const totaisInfantil = calcularTotais(infantil);
  const totaisFundamental = calcularTotais(fundamental);
  const totaisMedio = calcularTotais(medio);

  totaisInfantil.percentual = totaisInfantil.meta > 0
    ? ((totaisInfantil.total2026 / totaisInfantil.meta) * 100).toFixed(1)
    : 0;
  totaisFundamental.percentual = totaisFundamental.meta > 0
    ? ((totaisFundamental.total2026 / totaisFundamental.meta) * 100).toFixed(1)
    : 0;
  totaisMedio.percentual = totaisMedio.meta > 0
    ? ((totaisMedio.total2026 / totaisMedio.meta) * 100).toFixed(1)
    : 0;

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

  // Renderiza informacao de turmas
  const renderTurmaInfo = (item) => {
    const alunosPorTurma = getAlunosPorTurma(item.serie);
    const turmaInfo = calcularTurmas(item.total_2026, alunosPorTurma);

    // Gera as turmas completas
    const turmasCompletasArray = [];
    for (let i = 0; i < turmaInfo.turmasCompletas; i++) {
      turmasCompletasArray.push(String.fromCharCode(65 + i));
    }

    return (
      <div className="turma-info">
        {/* Turmas completas */}
        {turmasCompletasArray.length > 0 && (
          <div className="turmas-completas">
            {turmasCompletasArray.map(letra => (
              <span key={letra} className="turma-badge complete">
                {letra} <span className="turma-check">✓</span>
              </span>
            ))}
          </div>
        )}

        {/* Turma atual em preenchimento */}
        {turmaInfo.alunosTurmaAtual > 0 && (
          <div className="turma-atual">
            <span className="turma-badge current">
              {turmaInfo.turmaAtual}
            </span>
            <div className="turma-progress">
              <div className="turma-progress-bar">
                <div
                  className="turma-progress-fill"
                  style={{ width: `${(turmaInfo.alunosTurmaAtual / alunosPorTurma) * 100}%` }}
                ></div>
              </div>
              <span className="turma-progress-text">
                {turmaInfo.alunosTurmaAtual}/{alunosPorTurma}
              </span>
            </div>
            <span className="turma-faltam">
              Faltam {turmaInfo.faltamParaCompletar}
            </span>
          </div>
        )}

        {/* Se nao tem alunos */}
        {item.total_2026 === 0 && (
          <div className="turma-atual">
            <span className="turma-badge empty">A</span>
            <span className="turma-faltam">Aguardando</span>
          </div>
        )}
      </div>
    );
  };

  // Renderiza uma linha da tabela
  const renderRow = (item, index) => {
    const statusClass = getStatusClass(item.percentual);
    const statusLabel = getStatusLabel(item.percentual);

    return (
      <tr key={index} className={item.gap <= 0 ? 'row-success' : ''}>
        <td>
          <div className="serie-name">
            {item.serie}
          </div>
        </td>
        <td className="value-cell highlight-cell">
          <strong>{item.total_2026}</strong>
        </td>
        <td className="turma-cell">
          {renderTurmaInfo(item)}
        </td>
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
  };

  // Renderiza linha de subtotal
  const renderSubtotal = (totais, label, alunosPorTurma) => {
    const statusClass = getStatusClass(parseFloat(totais.percentual));
    const turmaInfo = calcularTurmas(totais.total2026, alunosPorTurma);

    return (
      <tr className="subtotal-row">
        <td><strong>{label}</strong></td>
        <td className="value-cell highlight-cell"><strong>{totais.total2026}</strong></td>
        <td className="turma-cell">
          <span className="turma-summary">
            {turmaInfo.turmasCompletas} turma{turmaInfo.turmasCompletas !== 1 ? 's' : ''} completa{turmaInfo.turmasCompletas !== 1 ? 's' : ''}
          </span>
        </td>
        <td className="value-cell"><strong>{totais.meta}</strong></td>
        <td className={`value-cell ${totais.gap <= 0 ? 'value-positive' : 'value-negative'}`}>
          <strong>{totais.gap <= 0 ? totais.gap : `+${totais.gap}`}</strong>
        </td>
        <td>
          <div className="mini-progress">
            <div className="mini-progress-bar">
              <div
                className={`mini-progress-fill ${statusClass}`}
                style={{ width: `${Math.min(totais.percentual, 100)}%` }}
              ></div>
            </div>
            <span className={`mini-progress-value ${parseFloat(totais.percentual) >= 100 ? 'value-positive' : ''}`}>
              <strong>{totais.percentual}%</strong>
            </span>
          </div>
        </td>
        <td></td>
      </tr>
    );
  };

  return (
    <div className="dashboard">
      {/* Referencia 2025 - Simples */}
      <div className="reference-2025">
        <span className="reference-label">Referência 2025:</span>
        <span className="reference-value">{total2025} matrículas</span>
        <span className={`reference-trend ${variacao >= 0 ? 'up' : 'down'}`}>
          {variacao >= 0 ? '↑' : '↓'} {Math.abs(variacao)}% vs 2025
        </span>
      </div>

      {/* Cards Principais - Destaque 2026 */}
      <div className="cards-container">
        <div className="metric-card highlight">
          <div className="metric-card-header">
            <span className="metric-card-title">Matrículas 2026</span>
            <div className="metric-card-icon">🎯</div>
          </div>
          <div className="metric-card-value">{total2026}</div>
          <div className="metric-card-subtitle">
            Total de matrículas atuais
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-card-header">
            <span className="metric-card-title">Meta 2026</span>
            <div className="metric-card-icon">🏆</div>
          </div>
          <div className="metric-card-value">{meta}</div>
          <div className="metric-card-subtitle">
            Objetivo de matrículas
          </div>
        </div>

        <div className="metric-card danger">
          <div className="metric-card-header">
            <span className="metric-card-title">Faltam</span>
            <div className="metric-card-icon">📊</div>
          </div>
          <div className="metric-card-value">{gap > 0 ? gap : 0}</div>
          <div className="metric-card-subtitle">
            {gap <= 0 ? 'Meta atingida!' : 'Para atingir a meta'}
          </div>
        </div>
      </div>

      {/* Barra de Progresso Geral */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-title">Progresso da Meta 2026</span>
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

      {/* Legenda de Turmas */}
      <div className="turma-legend">
        <div className="turma-legend-item">
          <span className="turma-badge complete small">A <span className="turma-check">✓</span></span>
          <span>Turma completa</span>
        </div>
        <div className="turma-legend-item">
          <span className="turma-badge current small">B</span>
          <span>Turma em preenchimento</span>
        </div>
        <div className="turma-legend-info">
          <span>💒 Infantil: 20 alunos/turma</span>
          <span>📘 Fundamental: 24 alunos/turma</span>
          <span>📗 Médio: 48 alunos/turma</span>
        </div>
      </div>

      {/* Tabela de Dados por Segmento */}
      <div className="table-section">
        <div className="table-header">
          <div>
            <h3 className="table-title">Detalhamento por Série</h3>
            <p className="table-subtitle">Organizado por segmento com status de turmas</p>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Série</th>
                <th className="highlight-header">2026</th>
                <th>Turmas</th>
                <th>Meta</th>
                <th>Gap</th>
                <th>Progresso</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Educação Infantil */}
              {infantil.length > 0 && (
                <>
                  <tr className="segment-header">
                    <td colSpan="7">
                      <div className="segment-title">
                        <span className="segment-icon">💒</span>
                        Educação Infantil
                        <span className="segment-info">(20 alunos por turma • Meta: 2 turmas)</span>
                      </div>
                    </td>
                  </tr>
                  {infantil.map((item, index) => renderRow(item, `inf-${index}`))}
                  {renderSubtotal(totaisInfantil, 'Subtotal Infantil', ALUNOS_POR_TURMA_INFANTIL)}
                </>
              )}

              {/* Ensino Fundamental */}
              <tr className="segment-header">
                <td colSpan="7">
                  <div className="segment-title">
                    <span className="segment-icon">📘</span>
                    Ensino Fundamental
                    <span className="segment-info">(24 alunos por turma • Meta: 2 turmas)</span>
                  </div>
                </td>
              </tr>
              {fundamental.map((item, index) => renderRow(item, `fund-${index}`))}
              {renderSubtotal(totaisFundamental, 'Subtotal Fundamental', ALUNOS_POR_TURMA_FUNDAMENTAL)}

              {/* Ensino Médio */}
              <tr className="segment-header">
                <td colSpan="7">
                  <div className="segment-title">
                    <span className="segment-icon">📗</span>
                    Ensino Médio
                    <span className="segment-info">(48 alunos por turma • Meta: 1 turma)</span>
                  </div>
                </td>
              </tr>
              {medio.map((item, index) => renderRow(item, `medio-${index}`))}
              {renderSubtotal(totaisMedio, 'Subtotal Médio', ALUNOS_POR_TURMA_MEDIO)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
