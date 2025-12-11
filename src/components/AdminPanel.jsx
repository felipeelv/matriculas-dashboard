import React, { useState } from 'react';

function AdminPanel({ dados, onUpdateDados, onVoltar }) {
  const [editingData, setEditingData] = useState([...dados]);
  const [saved, setSaved] = useState(false);

  // Separa por segmento
  const fundamental = editingData
    .filter(item => item.serie.includes('ANO'))
    .sort((a, b) => parseInt(a.serie.match(/\d+/)[0]) - parseInt(b.serie.match(/\d+/)[0]));

  const medio = editingData
    .filter(item => item.serie.includes('SÉRIE'))
    .sort((a, b) => parseInt(a.serie.match(/\d+/)[0]) - parseInt(b.serie.match(/\d+/)[0]));

  const handleChange = (serie, field, value) => {
    const newData = editingData.map(item => {
      if (item.serie === serie) {
        const updated = { ...item, [field]: parseInt(value) || 0 };
        // Recalcula gap e percentual
        updated.gap = updated.meta - updated.total_2026;
        updated.percentual = updated.meta > 0
          ? parseFloat(((updated.total_2026 / updated.meta) * 100).toFixed(1))
          : 0;
        return updated;
      }
      return item;
    });
    setEditingData(newData);
    setSaved(false);
  };

  const handleSave = () => {
    onUpdateDados(editingData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddMatricula = (serie, quantidade = 1) => {
    const newData = editingData.map(item => {
      if (item.serie === serie) {
        const updated = { ...item, total_2026: item.total_2026 + quantidade };
        updated.gap = updated.meta - updated.total_2026;
        updated.percentual = updated.meta > 0
          ? parseFloat(((updated.total_2026 / updated.meta) * 100).toFixed(1))
          : 0;
        return updated;
      }
      return item;
    });
    setEditingData(newData);
    setSaved(false);
  };

  const renderSegment = (segmentData, segmentName, icon) => (
    <div className="admin-segment">
      <div className="admin-segment-header">
        <span className="segment-icon">{icon}</span>
        <h3>{segmentName}</h3>
      </div>
      <div className="admin-cards">
        {segmentData.map((item) => (
          <div key={item.serie} className="admin-card">
            <div className="admin-card-header">
              <h4>{item.serie}</h4>
              <span className={`admin-status ${item.gap <= 0 ? 'complete' : ''}`}>
                {item.gap <= 0 ? 'Meta Atingida' : `Faltam ${item.gap}`}
              </span>
            </div>

            <div className="admin-card-body">
              <div className="admin-field">
                <label>Matriculas 2026</label>
                <div className="admin-input-group">
                  <button
                    className="admin-btn-adjust"
                    onClick={() => handleAddMatricula(item.serie, -1)}
                    disabled={item.total_2026 <= 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.total_2026}
                    onChange={(e) => handleChange(item.serie, 'total_2026', e.target.value)}
                    min="0"
                  />
                  <button
                    className="admin-btn-adjust add"
                    onClick={() => handleAddMatricula(item.serie, 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="admin-field">
                <label>Meta (por turma)</label>
                <div className="admin-meta-display">
                  <span className="meta-value">{item.meta}</span>
                  <span className="meta-info">
                    {item.serie.includes('ANO') ? '2 turmas x 24' : '1 turma x 48'}
                  </span>
                </div>
              </div>

              <div className="admin-progress-info">
                <div className="admin-progress-bar">
                  <div
                    className={`admin-progress-fill ${item.percentual >= 100 ? 'complete' : item.percentual >= 50 ? 'warning' : 'danger'}`}
                    style={{ width: `${Math.min(item.percentual, 100)}%` }}
                  ></div>
                </div>
                <span className="admin-progress-text">{item.percentual}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Calcula totais
  const totalMatriculas = editingData.reduce((acc, curr) => acc + curr.total_2026, 0);
  const totalMeta = editingData.reduce((acc, curr) => acc + curr.meta, 0);

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-left">
          <button className="admin-btn-back" onClick={onVoltar}>
            ← Voltar ao Dashboard
          </button>
          <h2>Gerenciar Matriculas</h2>
        </div>
        <div className="admin-header-right">
          <div className="admin-total">
            <span className="admin-total-label">Total Atual:</span>
            <span className="admin-total-value">{totalMatriculas}</span>
            <span className="admin-total-separator">/</span>
            <span className="admin-total-meta">{totalMeta}</span>
          </div>
          <button
            className={`admin-btn-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
          >
            {saved ? '✓ Salvo!' : 'Salvar Alteracoes'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        {renderSegment(fundamental, 'Ensino Fundamental', '📘')}
        {renderSegment(medio, 'Ensino Medio', '📗')}
      </div>

      <div className="admin-quick-actions">
        <h3>Acoes Rapidas</h3>
        <p>Clique em uma serie para adicionar +1 matricula rapidamente:</p>
        <div className="quick-buttons">
          {editingData.map(item => (
            <button
              key={item.serie}
              className={`quick-btn ${item.gap <= 0 ? 'complete' : ''}`}
              onClick={() => handleAddMatricula(item.serie, 1)}
            >
              {item.serie}
              <span className="quick-btn-count">{item.total_2026}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
