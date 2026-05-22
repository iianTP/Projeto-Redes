import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { sendData } from './api'

function AdminCadastroInstituicao() {
  const [nome, setNome] = useState('')
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('isAdmin') != 'true') {
      navigate('/editais')
    }
  },[]);

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!nome.trim()) {
      setStatus('Informe o nome da instituição.');
      return
    }

    sendData('admin/cadastrar-instituicao',{nome:nome})
    .then(res => {
      setStatus(res.msg);
    })
    .catch(err => {
      setStatus(`Falha: ${err.message}`)
    });

    // const formData = new FormData()
    // formData.append('Nome', nome)

    // try {
    //   const response = await fetch('http://127.0.0.1:8080/admin/cadastrar-instituicao', {
    //     method: 'POST',
    //     body: formData,
    //   })
    //   const result = await response.json()

    //   if (result.success) {
    //     setStatus('Instituição cadastrada com sucesso.')
    //     navigate('/admin')
    //   } else {
    //     setStatus(`Falha: ${result.error || 'erro desconhecido'}`)
    //   }
    // } catch (error) {
    //   setStatus('Erro de conexão com o servidor.')
    //   console.error(error)
    // }


  }

  return (
    <main id="center">
      <section classNome="hero">
        <h1>Cadastrar Instituição</h1>
      </section>

      <form classNome="upload-form" onSubmit={handleSubmit}>
        <label>
          Nome da instituição
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da instituição"
          />
        </label>

        <button type="submit" classNome="counter">
          Cadastrar instituição
        </button>
      </form>

      {status && <p classNome="status-message">{status}</p>}

      <button type="button" classNome="counter" onClick={() => navigate('/admin')}>
        Voltar para painel admin
      </button>
    </main>
  )
}

export default AdminCadastroInstituicao
