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

  const navigate = useNavigate()
  
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logoArea">
          <svg
            className="headerIcon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />

            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>

          <span className="headerTitle">
            Editais de Intercâmbio
          </span>
        </div>

        <div className="cadastros">
          {localStorage.getItem(
            'isAdmin'
          ) === 'true' && (
            <>
              <button
                className="logoutBtn"
                onClick={() => (window.location.href = '/Admin')}
              >
                Cadastrar
              </button>
                  
              <button className="logoutBtn" onClick={handleLogout}>
                <svg
                  className="logoutIcon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sair
              </button>
            </>
              
          )}

          {localStorage.getItem('isLogged') === 'true' &&
          localStorage.getItem('isAdmin') !== 'true' && (
            <>
              <button
                className="logoutBtn"
                onClick={() => (window.location.href = '/candidaturas')}
              >
                Minhas candidaturas
              </button>
                      
              <button className="logoutBtn" onClick={handleLogout}>
                <svg
                  className="logoutIcon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sair
              </button>
            </>
            )}

        </div>
      </header>

      <main className="mainContent">
        <section className="filterSection">
          <h3 className="sectionTitle">
            Buscar e filtrar
          </h3>

          <div className="searchBarContainer">
            <span className="searchIcon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Pesquisar por título..."
              value={busca}
              onChange={(e) =>
                setBusca(e.target.value)
              }
              className="searchInput"
            />
          </div>

          <div className="selectGrid">
            <select
              className="select"
              onChange={(e) =>
                setFiltroInstiticao(
                  e.target.value
                )
              }
            >
              <option value="Todos">
                Todos — Instituição
              </option>

              {instituicoes.map((inst) => (
                <option
                  key={inst.nome}
                  value={inst.nome}
                >
                  {inst.nome}
                </option>
              ))}
            </select>

            <select
              className="select"
              onChange={(e) =>
                setFiltroCurso(
                  e.target.value
                )
              }
            >
              <option value="Todos">
                Todos — Curso
              </option>

              {cursos.map((curso) => (
                <option
                  key={curso}
                  value={curso}
                >
                  {curso}
                </option>
              ))}
            </select>

            <select
              className="select"
              onChange={(e) =>
                setFiltroPais(
                  e.target.value
                )
              }
            >
              <option value="Todos">
                Todos — País
              </option>

              {paises.map((pais) => (
                <option
                  key={pais}
                  value={pais}
                >
                  {pais}
                </option>
              ))}
            </select>

            <select
              className="select"
              onChange={(e) =>
                setFiltroStatus(
                  e.target.value
                )
              }
            >
              <option value="Todos">
                Todos — Status
              </option>

              {[
                'Em andamento',
                'Em breve',
                'Encerrado',
              ].map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="counter">
          {editaisFiltrados.length}{' '}
          edita
          {editaisFiltrados.length === 1
            ? 'l encontrado'
            : 'is encontrados'}
        </div>

        <div className="listContainer">
          {editaisFiltrados.map(
            (edital, index) => (
              <CardEdital
                key={index}
                edital={edital}
              />
            )
          )}
        </div>
      </main>
    </div>
  )
}

export default Editais