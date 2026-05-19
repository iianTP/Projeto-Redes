import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import App2 from './App2.jsx'
import Login from './Login.jsx'
import Editais from './Editais.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/aaa' element={<App2 />} />
        <Route path='/login' element={<Login />} />
        <Route path='/editais' element={<Editais />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
