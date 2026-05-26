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
  <div className="container">
    {/* Header */}
    <header className="header">
      <div className="logoArea">
        <svg className="headerIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
        <span className="headerTitle">Minhas Candidaturas</span>
      </div>

      <div className="headerActions">
        <button className="backBtn" onClick={() => navigate('/editais')}>
          ← Voltar aos Editais
        </button>

        <button className="logoutBtn" onClick={handleLogout}>
          <svg className="logoutIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sair
        </button>
      </div>
    </header>

    <main className="mainContent">
      {/* Usuário */}
      <section className="userSection">
        <div className="userCard">
          <h3 className="userName">{user?.nome}</h3>
          <p className="userInfo">Curso: {user?.curso}</p>
          <p className="userInfo">Unidade: {user?.unidadeEnsino}</p>
        </div>
      </section>

      {/* Loading */}
      {carregando ? (
        <div className="loadingContainer">
          <p className="loadingText">Carregando candidaturas...</p>
        </div>
      ) : erro ? (
        <div className="errorContainer">
          <p className="errorText">{erro}</p>
        </div>
      ) : candidaturas.length === 0 ? (
        <div className="emptyContainer">
          <svg className="emptyIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12h6m-6 4h6m2-15H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z"/>
          </svg>

          <p className="emptyText">
            Você ainda não se candidatou a nenhum edital
          </p>

          <button className="browseBtn" onClick={() => navigate('/editais')}>
            Explorar Editais
          </button>
        </div>
      ) : (
        <div className="listContainer">
          <h3 className="sectionTitle">
            Candidaturas ({candidaturas.length})
          </h3>

          {candidaturas.map((candidatura) => {
            const status = getStatusBadge(candidatura.status);

            return (
              <div key={candidatura.id} className="candidaturaCard">
                <div className="cardHeader">
                  <div className="cardTitle">
                    <h4 className="editalTitulo">
                      {candidatura.edital?.titulo || 'Edital indisponível'}
                    </h4>

                    <p className="editalInfo">
                      {candidatura.edital?.instituicao} · {candidatura.edital?.pais}
                    </p>
                  </div>

                  <span
                    className="statusBadge"
                    style={{ backgroundColor: status.color }}
                  >
                    {status.texto}
                  </span>
                </div>

                <div className="cardDetails">
                  <div className="detailItem">
                    <span className="detailLabel">Data da Candidatura:</span>
                    <span className="detailValue">
                      {new Date(candidatura.data_candidatura).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {candidatura.edital && (
                    <>
                      <div className="detailItem">
                        <span className="detailLabel">Período do Edital:</span>
                        <span className="detailValue">
                          {new Date(candidatura.edital.dataInicio).toLocaleDateString('pt-BR')} até{" "}
                          {new Date(candidatura.edital.dataFim).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <div className="detailItem">
                        <span className="detailLabel">Descrição:</span>
                        <span className="detailValue">
                          {candidatura.edital.descricao}
                        </span>
                      </div>
                    </>
                  )}

                  {candidatura.documentos?.length > 0 && (
                    <div className="detailItem">
                      <span className="detailLabel">Documentos:</span>

                      <div className="documentList">
                        {candidatura.documentos.map((doc, idx) => (
                          <span key={idx} className="documentTag">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  </div>
);
}

export default Candidaturas;
