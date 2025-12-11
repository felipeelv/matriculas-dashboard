import React from 'react';
import { calcularProjecoes } from '../lib/exportUtils';

function Projecoes({ dados, totais }) {
  const projecoes = calcularProjecoes(dados, totais);

  return (
    <div className="projecoes-section">
      <div className="projecoes-header">
        <h3 className="projecoes-title">Projeções e Estimativas</h3>
        <p className="projecoes-subtitle">Baseado no ritmo atual de matrículas</p>
      </div>

      <div className="projecoes-grid">
        <div className="projecao-card">
          <div className="projecao-icon">📈</div>
          <div className="projecao-content">
            <span className="projecao-value">{projecoes.matriculasPorDia}</span>
            <span className="projecao-label">Matrículas por dia</span>
          </div>
        </div>

        <div className="projecao-card">
          <div className="projecao-icon">🎯</div>
          <div className="projecao-content">
            <span className="projecao-value">{projecoes.matriculasNecessariasPorDia}</span>
            <span className="projecao-label">Necessárias/dia para meta</span>
          </div>
        </div>

        <div className={`projecao-card ${projecoes.atingiraMeta ? 'success' : 'warning'}`}>
          <div className="projecao-icon">📊</div>
          <div className="projecao-content">
            <span className="projecao-value">{projecoes.projecaoFimAno}</span>
            <span className="projecao-label">Projeção fim do ano</span>
          </div>
        </div>

        <div className="projecao-card">
          <div className="projecao-icon">📅</div>
          <div className="projecao-content">
            <span className="projecao-value">
              {projecoes.dataEstimadaMeta
                ? projecoes.dataEstimadaMeta.toLocaleDateString('pt-BR')
                : 'Meta atingida!'}
            </span>
            <span className="projecao-label">Data estimada para meta</span>
          </div>
        </div>
      </div>

      <div className="projecao-status">
        {projecoes.atingiraMeta ? (
          <div className="projecao-alert success">
            ✅ No ritmo atual, você <strong>atingirá a meta</strong> até o fim do ano!
          </div>
        ) : (
          <div className="projecao-alert warning">
            ⚠️ Para atingir a meta, você precisa aumentar para <strong>{projecoes.matriculasNecessariasPorDia} matrículas/dia</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projecoes;
