import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SelectCountryList from 'react-select-country-list'
import './App.css'
import { getData, sendData, sendFile } from './api'

function AdminCadastroEdital() {
    
  const [instituicoes, setInstituicoes] = useState([])
  const [cursos, setCursos] = useState([])
  const [paises, setPaises] = useState([])

  const [titulo, setTitulo] = useState('');
  const [instituicao, setInstituicao] = useState('')
  const [pais, setPais] = useState('')
  const [cursoSelecionado, setCursoSelecionado] = useState([])
  const [pdf, setPdf] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(async () => {

    //fetch('http://127.0.0.1:8080/admin/instituicoes')
    //.then((res) => res.json())
    await getData('instituicoes.json')
    .then(setInstituicoes)
    .catch(() => setStatus('Não foi possível carregar as instituições.'))

    //fetch('http://127.0.0.1:8080/admin/cursos')
    //.then((res) => res.json())
    await getData('cursos.json')
    .then(setCursos)
    .catch(() => setStatus('Não foi possível carregar os cursos.'))

    const options = SelectCountryList().getData()
    const paisesNomes = options.map((item) => item.label)
    setPaises(paisesNomes)


  }, [])

  const handleCursoChange = (event) => {
    const value = event.target.value
    setCursoSelecionado((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!instituicao || !pais || cursoSelecionado.length === 0 || !pdf) {
      setStatus('Preencha todos os campos e selecione o arquivo PDF.')
      return
    }

    var edital = {
      id: 'default-id',
      titulo: titulo,
      instituicao: instituicao,
      curso: "default-curso",
      pais: pais,
      statusText: "Em andamento",
      statusType: "andamento",
      pdfPath: pdf.name,
      descricao: "default-descrição",
      dataInicio: "dd/mm/yyyy",
      dataFim: "dd/mm/yyyy"
    }

    sendData('admin/cadastrar-edital', edital)
    .then(() => {
      sendFile(pdf)
      .catch(err => setStatus(`Falha: {}`))
    })
    .catch(err => setStatus(`Falha: {}`))



    // const formData = new FormData()
    // formData.append('instituicao', instituicao)
    // formData.append('pais', pais)
    // formData.append('cursosAceitos', JSON.stringify(cursoSelecionado))
    // formData.append('pdf', pdf)

    // try {
    //   const response = await fetch('http://127.0.0.1:8080/admin/cadastrar-edital', {
    //     method: 'POST',
    //     body: formData,
    //   })
    //   const result = await response.json()

    //   if (result.success) {
    //     setStatus('Edital cadastrado com sucesso.')
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
    <main id="center" className="container">
      <section>
        <h1 className="sectionTitle">Cadastrar Edital</h1>
      </section>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label>
          Título do edital

          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título do edital"
          />
        </label>

        <label>
          Instituição

          <select
            className="select"
            value={instituicao}
            onChange={(e) => setInstituicao(e.target.value)}
          >
            <option value="">Selecione</option>

            {Object.values(instituicoes).map((item) => (
              <option key={item.nome} value={item.nome}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          País

          <select
            className="select"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
          >
            <option value="">Selecione</option>

            {paises.map((paisItem) => (
              <option key={paisItem} value={paisItem}>
                {paisItem}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="filterSection">
          <legend className="sectionTitle">
            Cursos aceitos
          </legend>

          <div className="cadastros">
            {cursos.map((curso) => (
              <label key={curso}>
                <input
                  type="checkbox"
                  value={curso}
                  checked={cursoSelecionado.includes(curso)}
                  onChange={handleCursoChange}
                />

                {curso}
              </label>
            ))}
          </div>
        </fieldset>

        <label>
          Arquivo do edital (PDF)

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setPdf(e.target.files?.[0] ?? null)
            }
          />
        </label>

        <button type="submit" className="botao">
          Cadastrar edital
        </button>

        <Link to="/admin" className="botao">
          Voltar para painel admin
        </Link>

        {status && (
          <p className="status-message">
            {status}
          </p>
        )}
      </form>
    </main>
  )
} 

export default AdminCadastroEdital