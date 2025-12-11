import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Exportar para Excel
export const exportToExcel = (dados, totais) => {
  // Preparar dados para a planilha
  const worksheetData = [
    ['Dashboard de Matrículas 2026'],
    ['Gerado em:', new Date().toLocaleString('pt-BR')],
    [],
    ['Série', '2025', '2026', 'Meta', 'Gap', 'Progresso (%)'],
    ...dados.map(item => [
      item.serie,
      item.total_2025,
      item.total_2026,
      item.meta,
      item.gap,
      `${item.percentual}%`
    ]),
    [],
    ['TOTAIS'],
    ['Total 2025:', totais.total2025],
    ['Total 2026:', totais.total2026],
    ['Meta:', totais.meta],
    ['Faltam:', totais.gap],
    ['Progresso:', `${totais.percentual}%`]
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Ajustar largura das colunas
  worksheet['!cols'] = [
    { wch: 15 }, // Série
    { wch: 10 }, // 2025
    { wch: 10 }, // 2026
    { wch: 10 }, // Meta
    { wch: 10 }, // Gap
    { wch: 15 }, // Progresso
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Matrículas 2026');

  // Download
  XLSX.writeFile(workbook, `matriculas_2026_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Exportar para PDF
export const exportToPDF = (dados, totais) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129); // Verde
  doc.text('Dashboard de Matrículas 2026', 14, 22);

  // Subtítulo
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Relatório gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

  // Resumo
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Resumo Geral', 14, 45);

  doc.setFontSize(10);
  doc.text(`Total de Matrículas 2026: ${totais.total2026}`, 14, 55);
  doc.text(`Meta: ${totais.meta}`, 14, 62);
  doc.text(`Faltam: ${totais.gap > 0 ? totais.gap : 0}`, 14, 69);
  doc.text(`Progresso: ${totais.percentual}%`, 14, 76);

  // Tabela de dados
  const tableData = dados.map(item => [
    item.serie,
    item.total_2025,
    item.total_2026,
    item.meta,
    item.gap > 0 ? `+${item.gap}` : item.gap,
    `${item.percentual}%`
  ]);

  doc.autoTable({
    startY: 85,
    head: [['Série', '2025', '2026', 'Meta', 'Gap', 'Progresso']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 25, halign: 'center' }
    }
  });

  // Rodapé
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Download
  doc.save(`matriculas_2026_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Calcular projeções
export const calcularProjecoes = (dados, totais) => {
  const hoje = new Date();
  const inicioAno = new Date(2025, 0, 1); // Janeiro 2025
  const fimAno = new Date(2025, 11, 31); // Dezembro 2025

  // Dias desde o início do ano
  const diasPassados = Math.floor((hoje - inicioAno) / (1000 * 60 * 60 * 24));
  const diasNoAno = Math.floor((fimAno - inicioAno) / (1000 * 60 * 60 * 24));
  const diasRestantes = diasNoAno - diasPassados;

  // Taxa média de matrículas por dia
  const matriculasPorDia = diasPassados > 0 ? totais.total2026 / diasPassados : 0;

  // Projeção até o fim do ano
  const projecaoFimAno = Math.round(totais.total2026 + (matriculasPorDia * diasRestantes));

  // Dias para atingir a meta (se mantiver o ritmo atual)
  const faltam = totais.meta - totais.total2026;
  const diasParaMeta = matriculasPorDia > 0 ? Math.ceil(faltam / matriculasPorDia) : null;

  // Data estimada para atingir a meta
  let dataEstimadaMeta = null;
  if (diasParaMeta && diasParaMeta > 0) {
    dataEstimadaMeta = new Date(hoje.getTime() + diasParaMeta * 24 * 60 * 60 * 1000);
  }

  // Matrículas necessárias por dia para atingir meta até fim do ano
  const matriculasNecessariasPorDia = diasRestantes > 0 ? Math.ceil(faltam / diasRestantes) : 0;

  return {
    matriculasPorDia: matriculasPorDia.toFixed(1),
    projecaoFimAno,
    diasParaMeta,
    dataEstimadaMeta,
    matriculasNecessariasPorDia,
    diasRestantes,
    atingiraMeta: projecaoFimAno >= totais.meta
  };
};
