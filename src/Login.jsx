import React, { useState, useEffect } from 'react';
import { login } from './api';
import { Link,Navigate, useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isNaN(cpf) && !isNaN(parseFloat(cpf))) {
      login({cpf:cpf,password:senha},setLogged,setIsAdmin)
      .then((res) => {
        localStorage.setItem('isAdmin',res.isAdmin)
        return res.valid
      })
      .then((logged) => {
        if (logged){
          navigate('/editais');
        }
      })
    }
  }

  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Ícone do Chapéu de Formatura */}
        <div style={styles.iconContainer}>
          <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        </div>

        <h2 style={styles.titulo}>Portal de Intercâmbio</h2>
        <p style={styles.subtitulo}>Acesse com seu CPF e senha para ver os editais</p>

        <form onSubmit={(e) => handleSubmit(e)} style={styles.form}>
          
          {/* Campo CPF */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>CPF</label>
            <input 
              type="text" 
              placeholder="000.000.000-00" 
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Campo Senha */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {erro && <p style={styles.errorText}>{erro}</p>}

          {/* Botão Entrar com ícone de cadeado */}
          <button type="submit" style={styles.botao}>
            <svg style={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Entrar
          </button>

        </form>
      </div>
    </div>
  );
}

// Estilização baseada fielmente no layout fornecido (Clean Dark/Light contrast)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100vh',          // Garante a altura total
    backgroundColor: '#f4f7f9',  // A cor de fundo que vai cobrir tudo
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
    border: '1px solid #eaeaea'
  },
  iconContainer: {
    backgroundColor: '#f1f3f5',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 20px auto'
  },
  icon: {
    width: '24px',
    height: '24px',
    color: '#343a40'
  },
  titulo: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#0f172a',
    margin: '0 0 8px 0'
  },
  subtitulo: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 30px 0'
  },
  form: {
    textAlign: 'left'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#334155',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    color: '#334155',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  botao: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '10px'
  },
  btnIcon: {
    width: '16px',
    height: '16px'
  },
  errorText: {
    color: '#ef4444',
    fontSize: '13px',
    margin: '0 0 10px 0',
    textAlign: 'center'
  }
};

export default Login;