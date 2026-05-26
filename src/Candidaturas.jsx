import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Candidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/candidaturas' } });
      return;
    }
    carregarCandidaturas();
  }, [navigate]);

  const carregarCandidaturas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/candidatura/listar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf_aluno: user.cpf }),
      });

      const data = await response.json();

      if (data.success) {
        setCandidaturas(data.candidaturas || []);
      } else {
        setErro(data.error || 'Erro ao carregar candidaturas');
      }
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro de conexão com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pendente': { texto: 'Pendente', color: '#f59e0b' },
      'aprovada': { texto: 'Aprovada', color: '#10b981' },
      'rejeitada': { texto: 'Rejeitada', color: '#ef4444' },
    };
    return statusMap[status] || { texto: status, color: '#6b7280' };
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <svg style={styles.headerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
          <span style={styles.headerTitle}>Minhas Candidaturas</span>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.backBtn} onClick={() => navigate('/editais')}>
            ← Voltar aos Editais
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <svg style={styles.logoutIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sair
          </button>
        </div>
      </header>

      <main style={styles.mainContent}>
        {/* Informações do usuário */}
        <section style={styles.userSection}>
          <div style={styles.userCard}>
            <h3 style={styles.userName}>{user?.nome}</h3>
            <p style={styles.userInfo}>Curso: {user?.curso}</p>
            <p style={styles.userInfo}>Unidade: {user?.unidadeEnsino}</p>
          </div>
        </section>

        {/* Lista de candidaturas */}
        {carregando ? (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Carregando candidaturas...</p>
          </div>
        ) : erro ? (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>{erro}</p>
          </div>
        ) : candidaturas.length === 0 ? (
          <div style={styles.emptyContainer}>
            <svg style={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2-15H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z"/>
            </svg>
            <p style={styles.emptyText}>Você ainda não se candidatou a nenhum edital</p>
            <button style={styles.browseBtn} onClick={() => navigate('/editais')}>
              Explorar Editais
            </button>
          </div>
        ) : (
          <div style={styles.listContainer}>
            <h3 style={styles.sectionTitle}>Candidaturas ({candidaturas.length})</h3>
            {candidaturas.map((candidatura) => (
              <div key={candidatura.id} style={styles.candidaturaCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <h4 style={styles.editalTitulo}>
                      {candidatura.edital?.titulo || 'Edital indisponível'}
                    </h4>
                    <p style={styles.editalInfo}>
                      {candidatura.edital?.instituicao} · {candidatura.edital?.pais}
                    </p>
                  </div>
                  <span 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusBadge(candidatura.status).color,
                    }}
                  >
                    {getStatusBadge(candidatura.status).texto}
                  </span>
                </div>

                <div style={styles.cardDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Data da Candidatura:</span>
                    <span style={styles.detailValue}>
                      {new Date(candidatura.data_candidatura).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {candidatura.edital && (
                    <>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Período do Edital:</span>
                        <span style={styles.detailValue}>
                          {new Date(candidatura.edital.dataInicio).toLocaleDateString('pt-BR')} até {' '}
                          {new Date(candidatura.edital.dataFim).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Descrição:</span>
                        <span style={styles.detailValue}>{candidatura.edital.descricao}</span>
                      </div>
                    </>
                  )}
                  {candidatura.documentos && candidatura.documentos.length > 0 && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Documentos:</span>
                      <div style={styles.documentList}>
                        {candidatura.documentos.map((doc, idx) => (
                          <span key={idx} style={styles.documentTag}>{doc}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    width: '28px',
    height: '28px',
    color: '#0f172a',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f172a',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#e2e8f0',
    border: 'none',
    cursor: 'pointer',
    color: '#334155',
    fontSize: '14px',
    padding: '8px 12px',
    borderRadius: '6px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#334155',
    fontSize: '14px',
  },
  logoutIcon: {
    width: '18px',
    height: '18px',
  },
  mainContent: {
    padding: '32px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  userSection: {
    marginBottom: '32px',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  userName: {
    margin: '0 0 12px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f172a',
  },
  userInfo: {
    margin: '6px 0',
    fontSize: '14px',
    color: '#64748b',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
  loadingText: {
    fontSize: '16px',
    color: '#64748b',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
  },
  errorText: {
    fontSize: '16px',
    color: '#991b1b',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    color: '#cbd5e1',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '20px',
  },
  browseBtn: {
    padding: '10px 20px',
    backgroundColor: '#0f172a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
  },
  candidaturaCard: {
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '20px',
    marginBottom: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  cardTitle: {
    flex: 1,
  },
  editalTitulo: {
    margin: '0 0 6px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
  },
  editalInfo: {
    margin: 0,
    fontSize: '13px',
    color: '#64748b',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '500',
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: '14px',
    color: '#334155',
  },
  documentList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px',
  },
  documentTag: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#f1f5f9',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#334155',
  },
};

export default Candidaturas;
