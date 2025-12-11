import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import './styles/App.css';
import dadosIniciais from './data.json';
import { supabase, isSupabaseConfigured } from './lib/supabase';

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
      // Verifica se Supabase está configurado
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('matriculas')
            .select('*')
            .order('id');

          if (error) throw error;

          if (data && data.length > 0) {
            setDados(data);
            setUseCloud(true);
          } else {
            // Primeira vez: insere dados iniciais no Supabase
            const { error: insertError } = await supabase
              .from('matriculas')
              .insert(dadosIniciais.map((item, index) => ({ ...item, id: index + 1 })));

            if (!insertError) {
              setUseCloud(true);
            }
          }
        } catch (err) {
          console.log('Supabase não disponível, usando localStorage:', err.message);
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
      } else {
        // Sem Supabase, usa localStorage
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

      // Se Supabase está configurado, salva lá também
      if (useCloud && isSupabaseConfigured()) {
        setSaving(true);
        try {
          // Atualiza cada registro
          for (const item of dados) {
            await supabase
              .from('matriculas')
              .update({
                total_2025: item.total_2025,
                total_2026: item.total_2026,
                meta: item.meta,
                gap: item.gap,
                percentual: item.percentual
              })
              .eq('serie', item.serie);
          }
        } catch (err) {
          console.error('Erro ao salvar no Supabase:', err);
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

      // Reset no Supabase também
      if (useCloud && isSupabaseConfigured()) {
        try {
          for (const item of dadosIniciais) {
            await supabase
              .from('matriculas')
              .update({
                total_2025: item.total_2025,
                total_2026: item.total_2026,
                meta: item.meta,
                gap: item.gap,
                percentual: item.percentual
              })
              .eq('serie', item.serie);
          }
        } catch (err) {
          console.error('Erro ao resetar no Supabase:', err);
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
