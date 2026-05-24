import React, { useState, useEffect } from 'react';
import CardEdital from '../components/CardEdital';
import SelectCountryList from 'react-select-country-list';
import { getData } from'./api.js';
import { useNavigate, Navigate } from 'react-router-dom';

function Editais() {
  const [editais, setEditais] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [busca, setBusca] = useState('');

  const [filtroInstiticao, setFiltroInstiticao] = useState('Todos');
  const [filtroCurso, setFiltroCurso] = useState('Todos');
  const [filtroPais, setFiltroPais] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  
  useEffect(async () => {
    
    await getData('editais.json').then((res) => setEditais(Object.values(res)));
    await getData('cursos.json').then((res) => setCursos(res));
    await getData('instituicoes.json').then((res) => setInstituicoes(Object.values(res)));

    const options = SelectCountryList().getData()
    const paisesNomes = options.map((item) => item.label)
    setPaises(paisesNomes)
  }, []);

  const editaisFiltrados = editais.filter(edital => 
    edital.titulo.toLowerCase().includes(busca.toLowerCase()) &&
    (filtroInstiticao === 'Todos' || edital.instituicao === filtroInstiticao) &&
    (filtroCurso      === 'Todos' || edital.curso       === filtroCurso) &&
    (filtroPais       === 'Todos' || edital.pais        === filtroPais) &&
    (filtroStatus     === 'Todos' || edital.statusText  === filtroStatus)
  );

  return (
    <div style={styles.container}>
      {/* Topbar / Header */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <svg style={styles.headerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
          <span style={styles.headerTitle}>Editais de Intercâmbio</span>
        </div>

        {localStorage.getItem('isAdmin') == 'true' && (
          <button style={styles.logoutBtn} onClick={() => window.location.href = '/admin'}>
            Cadastrar
          </button>
        )}

        <button style={styles.logoutBtn} onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}>
          <svg style={styles.logoutIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sair
        </button>
      </header>

      <main style={styles.mainContent}>
        {/* Seção de Filtros */}
        <section style={styles.filterSection}>
          <h3 style={styles.sectionTitle}>Buscar e filtrar</h3>
          <div style={styles.searchBarContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Pesquisar por título..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.selectGrid}>
            <select style={styles.select} onChange={(e) => setFiltroInstiticao(e.target.value)}>
              <option value="Todos">Todos — Instituição</option>
              {instituicoes.map((inst) => (
                <option value={inst.nome}>{inst.nome}</option>
              ))}
            </select>
            <select style={styles.select} onChange={(e) => setFiltroCurso(e.target.value)}>
              <option value="Todos">Todos — Curso</option>
              {cursos.map((curso) => (
                <option value={curso}>{curso}</option>
              ))}
            </select>
            <select style={styles.select} onChange={(e) => setFiltroPais(e.target.value)}>
              <option value="Todos">Todos — País</option>
              {paises.map((pais) => (
                <option value={pais}>{pais}</option>
              ))}
            </select>
            <select style={styles.select} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="Todos">Todos — Status</option>
              {['Em andamento','Em breve', 'Encerrado'].map((status) => (
                <option value={status}>{status}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Contador Dinâmico */}
        <div style={styles.counter}>
          {editaisFiltrados.length} edita{editaisFiltrados.length === 1 ? 'l encontrado' : 'is encontrados'}
        </div>

        {/* Lista Variável de Editais */}
        <div style={styles.listContainer}>
          {editaisFiltrados.map((edital,index) => (
            <CardEdital key={index/*edital.id*/} edital={edital} />
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '12px' },
  headerIcon: { width: '28px', height: '28px', color: '#0f172a' },
  headerTitle: { fontSize: '18px', fontWeight: '600', color: '#0f172a' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#334155', fontSize: '14px' },
  logoutIcon: { width: '18px', height: '18px' },
  mainContent: { padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' },
  filterSection: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: '0 0 16px 0' },
  searchBarContainer: { position: 'relative', marginBottom: '16px' },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  searchInput: { width: '100%', padding: '12px 14px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  selectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  select: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', outline: 'none', fontSize: '14px' },
  counter: { fontSize: '14px', color: '#64748b', marginBottom: '16px', textAlign: 'left' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '16px' }
};

export default Editais;