import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminCadastro from './AdminCadastro.jsx'
import AdminCadastroEdital from './AdminCadastroEdital.jsx'
import AdminCadastroAluno from './AdminCadastroAluno.jsx'
import AdminCadastroInstituicao from './AdminCadastroInstituicao.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/admin' element={<AdminCadastro />} />
        <Route path='/admin/edital' element={<AdminCadastroEdital />} />
        <Route path='/admin/aluno' element={<AdminCadastroAluno />} />
        <Route path='/admin/instituicao' element={<AdminCadastroInstituicao />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
