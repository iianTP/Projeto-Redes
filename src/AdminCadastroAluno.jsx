import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

function AdminCadastroAluno() {
  const [instituicoes, setInstituicoes] = useState([])
  const [cursos, setcursos] = useState([])

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [instituicao, setInstituicao] = useState('')
  const [curso, setCurso] = useState('')
  const [status, setStatus] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://127.0.0.1:8080/admintInstituicoes')
      .then((res) => res.json())
      .then(setInstituicoes)
      .catch(() => setStatus('Não foi possível carregar as instituições.'))

    fetch('http://127.0.0.1:8080/admin/cursos')
      .then((res) => res.json())
      .then(setcursos)
      .catch(() => setStatus('Não foi possível carregar os cursos.'))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!nome.trim() || !email.trim() || !cpf.trim() || !instituicao || !curso) {
      setStatus('Preencha todos os campos obrigatórios.')
      return
    }

    const formData = new FormData()
    formData.append('nome', nome)
    formData.append('email', email)
    formData.append('cpf', cpf)
    formData.append('instituicao', instituicao)
    formData.append('curso', curso)

    try {
      const response = await fetch('http://127.0.0.1:8080/admin/cadastrar-aluno', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()

      if (result.success) {
        setStatus('Aluno cadastrado com sucesso.')
        navigate('/admin')
      } else {
        setStatus(`Falha: ${result.error || 'erro desconhecido'}`)
      }
    } catch (error) {
      setStatus('Erro de conexão com o servidor.')
      console.error(error)
    }
  }

  return (
    <main id="center">
      <section classnome="hero">
        <h1>Cadastrar Aluno</h1>
      </section>

      <form classnome="upload-form" onSubmit={handleSubmit}>
        <label>
          Nome completo
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
          />
        </label>

        <label>
          E-mail institucional
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@instituicao.edu"
          />
        </label>

        <label>
          CPF
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCPF(e.target.value.replace(/\D/g, ''))}
            placeholder="Somente números"
          />
        </label>

        <label>
          Unidade de Ensino
          <select value={instituicao} onChange={(e) => setInstituicao(e.target.value)}>
            <option value="">Selecione</option>
            {instituicoes.map((item) => (
              <option key={item.nome} value={item.nome}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Curso
          <select value={curso} onChange={(e) => setCurso(e.target.value)}>
            <option value="">Selecione</option>
            {cursos.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" classnome="counter">
          Cadastrar aluno
        </button>
      </form>

      <button type="button" classnome="counter" onClick={() => navigate('/admin')}>
        Voltar para painel admin
      </button>
    </main>
  )
}

export default AdminCadastroAluno
