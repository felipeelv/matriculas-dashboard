import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

// Registra os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

function Charts({ dados, totaisInfantil, totaisFundamental, totaisMedio }) {
  // Dados para o gráfico de rosca (progresso por segmento)
  const segmentos = [
    { nome: 'Infantil', atual: totaisInfantil.total2026, meta: totaisInfantil.meta, cor: '#8b5cf6' },
    { nome: 'Fundamental', atual: totaisFundamental.total2026, meta: totaisFundamental.meta, cor: '#3b82f6' },
    { nome: 'Médio', atual: totaisMedio.total2026, meta: totaisMedio.meta, cor: '#10b981' }
  ];

  // Gráfico de Rosca - Progresso Geral
  const totalAtual = segmentos.reduce((acc, s) => acc + s.atual, 0);
  const totalMeta = segmentos.reduce((acc, s) => acc + s.meta, 0);
  const totalFalta = totalMeta - totalAtual;
  const percentualGeral = ((totalAtual / totalMeta) * 100).toFixed(1);

  const doughnutData = {
    labels: ['Matrículas Realizadas', 'Faltam'],
    datasets: [
      {
        data: [totalAtual, Math.max(0, totalFalta)],
        backgroundColor: [
          totalAtual >= totalMeta ? '#10b981' : '#3b82f6',
          '#e5e7eb'
        ],
        borderColor: [
          totalAtual >= totalMeta ? '#059669' : '#2563eb',
          '#d1d5db'
        ],
        borderWidth: 2,
        cutout: '75%',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Inter',
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const percent = ((value / totalMeta) * 100).toFixed(1);
            return `${context.label}: ${value} (${percent}%)`;
          }
        }
      }
    }
  };

  // Gráfico de Barras - Comparativo por Série
  const seriesData = dados.map(item => ({
    serie: item.serie,
    atual: item.total_2026,
    meta: item.meta,
    percentual: item.meta > 0 ? ((item.total_2026 / item.meta) * 100).toFixed(1) : 0
  }));

  const barData = {
    labels: seriesData.map(s => s.serie),
    datasets: [
      {
        type: 'bar',
        label: 'Matrículas 2026',
        data: seriesData.map(s => s.atual),
        backgroundColor: seriesData.map(s =>
          s.atual >= s.meta ? '#10b981' :
          s.atual >= s.meta * 0.75 ? '#f59e0b' :
          s.atual >= s.meta * 0.5 ? '#f97316' : '#ef4444'
        ),
        borderColor: seriesData.map(s =>
          s.atual >= s.meta ? '#059669' :
          s.atual >= s.meta * 0.75 ? '#d97706' :
          s.atual >= s.meta * 0.5 ? '#ea580c' : '#dc2626'
        ),
        borderWidth: 2,
        borderRadius: 6,
        order: 2,
      },
      {
        type: 'line',
        label: 'Meta',
        data: seriesData.map(s => s.meta),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        borderDash: [8, 4],
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.1,
        fill: false,
        order: 1,
      }
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Inter',
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            if (context.datasetIndex === 0) {
              const meta = seriesData[context.dataIndex].meta;
              const atual = context.raw;
              const falta = meta - atual;
              if (falta > 0) {
                return `Faltam: ${falta}`;
              }
              return 'Meta atingida!';
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  // Gráfico de Barras Horizontal - Por Segmento
  const segmentBarData = {
    labels: segmentos.map(s => s.nome),
    datasets: [
      {
        label: 'Atual',
        data: segmentos.map(s => s.atual),
        backgroundColor: segmentos.map(s =>
          s.atual >= s.meta ? '#10b981' : s.cor
        ),
        borderColor: segmentos.map(s =>
          s.atual >= s.meta ? '#059669' : s.cor
        ),
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: 'Meta',
        data: segmentos.map(s => s.meta),
        backgroundColor: 'rgba(156, 163, 175, 0.3)',
        borderColor: '#9ca3af',
        borderWidth: 2,
        borderRadius: 6,
      }
    ],
  };

  const segmentBarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Inter',
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            if (context.datasetIndex === 0) {
              const segmento = segmentos[context.dataIndex];
              const falta = segmento.meta - segmento.atual;
              const percent = ((segmento.atual / segmento.meta) * 100).toFixed(1);
              if (falta > 0) {
                return [`Progresso: ${percent}%`, `Faltam: ${falta}`];
              }
              return [`Progresso: ${percent}%`, 'Meta atingida!'];
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11
          }
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12,
            weight: '600'
          }
        }
      }
    }
  };

  // Gráfico de Evolução Mensal - Projeção
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const mesAtual = new Date().getMonth(); // 0-11

  // Simula dados históricos (crescimento linear até agora)
  const dadosMensais = [];
  const metaMensal = [];
  const incrementoMensal = totalMeta / 12;

  for (let i = 0; i <= 11; i++) {
    metaMensal.push(Math.round(incrementoMensal * (i + 1)));

    if (i < mesAtual) {
      // Meses passados: simula crescimento proporcional
      dadosMensais.push(Math.round((totalAtual / (mesAtual + 1)) * (i + 1)));
    } else if (i === mesAtual) {
      // Mês atual: valor real
      dadosMensais.push(totalAtual);
    } else {
      // Meses futuros: projeção baseada no ritmo atual
      const ritmoMensal = totalAtual / (mesAtual + 1);
      dadosMensais.push(Math.round(totalAtual + ritmoMensal * (i - mesAtual)));
    }
  }

  const evolutionData = {
    labels: meses,
    datasets: [
      {
        label: 'Matrículas',
        data: dadosMensais,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: dadosMensais.map((_, i) => i <= mesAtual ? '#3b82f6' : '#94a3b8'),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: dadosMensais.map((_, i) => i === mesAtual ? 8 : 5),
        pointHoverRadius: 8,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Meta Ideal',
        data: metaMensal,
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [8, 4],
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.1,
        fill: false,
      }
    ],
  };

  const evolutionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Inter',
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            if (context.datasetIndex === 0) {
              const mesIndex = context.dataIndex;
              if (mesIndex < mesAtual) {
                return '(estimado)';
              } else if (mesIndex === mesAtual) {
                return '← Mês atual';
              } else {
                return '(projeção)';
              }
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: totalMeta + 50,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11,
            weight: (context) => context.index === mesAtual ? '700' : '400'
          }
        }
      }
    }
  };

  return (
    <div className="charts-section">
      <div className="charts-grid">
        {/* Gráfico de Rosca - Progresso Geral */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Progresso Geral</h3>
            <p className="chart-subtitle">Meta total de matrículas</p>
          </div>
          <div className="chart-container doughnut-container">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="doughnut-center">
              <span className="doughnut-percent">{percentualGeral}%</span>
              <span className="doughnut-label">da meta</span>
            </div>
          </div>
          <div className="chart-stats">
            <div className="chart-stat">
              <span className="stat-value success">{totalAtual}</span>
              <span className="stat-label">Realizadas</span>
            </div>
            <div className="chart-stat">
              <span className="stat-value warning">{Math.max(0, totalFalta)}</span>
              <span className="stat-label">Faltam</span>
            </div>
            <div className="chart-stat">
              <span className="stat-value">{totalMeta}</span>
              <span className="stat-label">Meta</span>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras Horizontal - Por Segmento */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Progresso por Segmento</h3>
            <p className="chart-subtitle">Comparativo atual vs meta</p>
          </div>
          <div className="chart-container bar-horizontal-container">
            <Bar data={segmentBarData} options={segmentBarOptions} />
          </div>
        </div>
      </div>

      {/* Gráfico de Barras - Todas as Séries */}
      <div className="chart-card full-width">
        <div className="chart-header">
          <h3 className="chart-title">Detalhamento por Série</h3>
          <p className="chart-subtitle">Matrículas atuais vs meta por série</p>
        </div>
        <div className="chart-container bar-container">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="chart-legend-custom">
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#10b981' }}></span>
            <span>Meta atingida</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#f59e0b' }}></span>
            <span>75%+ da meta</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#f97316' }}></span>
            <span>50%+ da meta</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ef4444' }}></span>
            <span>Abaixo de 50%</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução Mensal */}
      <div className="chart-card full-width">
        <div className="chart-header">
          <h3 className="chart-title">Evolução Mensal</h3>
          <p className="chart-subtitle">Acompanhamento e projeção ao longo do ano</p>
        </div>
        <div className="chart-container line-container">
          <Line data={evolutionData} options={evolutionOptions} />
        </div>
        <div className="chart-legend-custom evolution-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#3b82f6' }}></span>
            <span>Matrículas realizadas</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#94a3b8' }}></span>
            <span>Projeção futura</span>
          </div>
          <div className="legend-item">
            <span className="legend-line" style={{ borderColor: '#10b981' }}></span>
            <span>Meta ideal mensal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
