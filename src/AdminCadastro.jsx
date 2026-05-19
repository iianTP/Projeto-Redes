import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

function AdminCadastro() {
  const [editais, setEditais] = useState([])
  const [status, setStatus] = useState('')

  return (
    <main id="center">
      <section className="hero">
        <h1>Área de Cadastramento</h1>
        <div className="cadastros">
          <Link to="/admin/edital" className="counter">
            Cadastrar Edital
          </Link>
          <Link to="/admin/aluno" className="counter">
            Cadastrar Aluno
          </Link>
          <Link to="/admin/instituicao" className="counter">
            Cadastrar Instituição
          </Link>
        </div>
      </section>

      <div className="ticks"></div>

      <Link to="/" className="counter">
        Voltar para Home
      </Link>
    </main>
  )
}

export default AdminCadastro
