import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import AdminCadastro from './AdminCadastro.jsx'
import AdminCadastroEdital from './AdminCadastroEdital.jsx'
import AdminCadastroAluno from './AdminCadastroAluno.jsx'
import AdminCadastroInstituicao from './AdminCadastroInstituicao.jsx'
import Login from './Login.jsx'
import Editais from './Editais.jsx'

function Protect({ children, check, redirect }) {

  if (localStorage.getItem(check) !== 'true') {
    return <Navigate to={redirect} replace />;
  }

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/editais' element={<Protect check='isLogged' redirect='/login'><Editais /></Protect>} />

        <Route path='/admin' element={<Protect check='isAdmin' redirect='/editais'><AdminCadastro /></Protect>} />
        <Route path='/admin/edital' element={<Protect check='isAdmin' redirect='/editais'><AdminCadastroEdital /></Protect>} />
        <Route path='/admin/aluno' element={<Protect check='isAdmin' redirect='/editais'><AdminCadastroAluno /></Protect>} />
        <Route path='/admin/instituicao' element={<Protect check='isAdmin' redirect='/editais'><AdminCadastroInstituicao /></Protect>} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
)
