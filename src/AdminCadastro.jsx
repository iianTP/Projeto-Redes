import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function AdminCadastro() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <main id="center" className="container">

      <section>
        <h1 className="sectionTitle">Área de Cadastramento</h1>

        <div className="cadastros">
          <Link to="/admin/edital" className="botao">
            Cadastrar Edital
          </Link>

          <Link to="/admin/aluno" className="botao">
            Cadastrar Aluno
          </Link>

          <Link to="/admin/instituicao" className="botao">
            Cadastrar Instituição
          </Link>
        </div>
      </section>

      <div className="ticks"></div>

      <div className="headerActions">
        <button
          className="backBtn"
          onClick={() => navigate('/editais')}
        >
          ← Voltar aos Editais
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
      </div>

    </main>
  );
}

export default AdminCadastro;