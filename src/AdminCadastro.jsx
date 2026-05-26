import { Link } from 'react-router-dom'
import './App.css'

function AdminCadastro() {
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

      <Link to="/editais" className="botao">
        Voltar para página de editais
      </Link>
    </main>
  )
}

export default AdminCadastro