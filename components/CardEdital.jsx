import React, { useState } from 'react';
import { downloadFile } from '../src/api';

function CardEdital({ edital }) {
  const [isAberto, setIsAberto] = useState(false);

  const handleDownload = (e, file) => {
    e.stopPropagation();
    downloadFile(`files/${file}`);
  };

  return (
    <div style={styles.card}>
      {/* título */}
      <div style={styles.topRow}>
        <div>
          <h4 style={styles.tituloEdital}>{edital.titulo}</h4>
          <p style={styles.metaEdital}>
            {edital.instituicao} · {edital.curso} · {edital.pais}
          </p>
        </div>
        <span style={{ ...styles.badge, ...styles[edital.statusType] }}>
          {edital.statusText}
        </span>
      </div>

      {/* botões de ação */}
      <div style={styles.actionRow}>
        <button style={styles.downloadBtn} onClick={(e) => handleDownload(e, edital.pdfPath)}>
          {/* ícone download */}
          <svg style={styles.iconBtn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Baixar PDF
        </button>
        {localStorage.getItem('isAdmin') == 'false' && (
          <button style={styles.applyBtn}>
            {/* ícone candidatura */}
            <svg style={styles.iconBtn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Candidatar-se
          </button>
        )}
      </div>

      {/* abrir/fechar aba retrátil */}
      <div style={styles.toggleTrigger} onClick={() => setIsAberto(!isAberto)}>
        <div style={styles.triggerLeft}>

          {/* ícone de documento */}
          <svg style={styles.docIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span style={styles.triggerText}>Ver detalhes</span>
        </div>
        
        {/* seta indicativa */}
        <svg 
          style={{ ...styles.arrowIcon, transform: isAberto ? 'rotate(180deg)' : 'rotate(0deg)' }} 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {/* conteúdo aba retrátil */}
      {isAberto && (
        <div style={styles.detailsContent}>

          <div style={styles.detailBlockFull}>
            <span style={styles.detailLabel}>DESCRIÇÃO</span>
            <p style={styles.detailText}>{edital.descricao}</p>
          </div>

          <div style={styles.gridInfo}>
            <div style={styles.detailBlock}>
              <span style={styles.detailLabel}>INSTITUIÇÃO PARCEIRA</span>
              <p style={styles.detailText}>{edital.instituicao}</p>
            </div>
            <div style={styles.detailBlock}>
              <span style={styles.detailLabel}>PAÍS</span>
              <p style={styles.detailText}>{edital.pais}</p>
            </div>
            <div style={styles.detailBlock}>
              <span style={styles.detailLabel}>DATA DE INÍCIO</span>
              <p style={styles.detailText}>{edital.dataInicio}</p>
            </div>
            <div style={styles.detailBlock}>
              <span style={styles.detailLabel}>DATA DE FINALIZAÇÃO</span>
              <p style={styles.detailText}>{edital.dataFim}</p>
            </div>
            <div style={styles.detailBlock}>
              <span style={styles.detailLabel}>STATUS</span>
              <p style={styles.detailText}>{edital.statusText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    textAlign: 'left',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    boxSizing: 'border-box',
    width: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  tituloEdital: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#08060d',
    margin: '0 0 6px 0',
    letterSpacing: '-0.3px'
  },
  metaEdital: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  badge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '-0.1px'
  },
  andamento: {
    backgroundColor: '#0f172a',
    color: '#ffffff'
  },
  breve: {
    backgroundColor: '#fef3c7',
    color: '#d97706'
  },
  encerrado: {
    backgroundColor: '#f1f5f9',
    color: '#64748b'
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#334155',
    transition: 'background-color 0.15s'
  },
  applyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0f172a',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
    transition: 'background-color 0.15s'
  },
  iconBtn: {
    width: '16px',
    height: '16px'
  },
  toggleTrigger: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    paddingTop: '8px',
    userSelect: 'none'
  },
  triggerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9', /* Fundo sutil cinza do botão "Ver detalhes" */
    transition: 'background-color 0.15s'
  },
  docIcon: {
    width: '16px',
    height: '16px',
    color: '#334155'
  },
  triggerText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#0f172a'
  },
  arrowIcon: {
    width: '18px',
    height: '18px',
    color: '#64748b',
    transition: 'transform 0.2s ease'
  },
  /* Layout Interno dos Detalhes (Sem fundos ou caixas cinzas adicionais) */
  detailsContent: {
    marginTop: '20px',
    paddingTop: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  detailBlockFull: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  gridInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', /* Divide as informações em duas colunas perfeitas */
    rowGap: '16px',
    columnGap: '40px'
  },
  detailBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  detailLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8', /* Cinza claro suave para o título da propriedade */
    letterSpacing: '0.6px'
  },
  detailText: {
    fontSize: '14px',
    color: '#0f172a', /* Texto interno escuro */
    margin: 0,
    lineHeight: '145%'
  }
};

export default CardEdital;