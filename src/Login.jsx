import React, { useState, useEffect } from 'react';
import { login } from './api';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setErro('');

    if (!cpf || !senha) {
      setErro('Informe CPF e senha.');
      return;
    }

    login({ cpf: cpf, password: senha })
      .then((res) => {
        if (res.valid) {
          localStorage.setItem('isLogged', 'true');
          localStorage.setItem('isAdmin', res.isAdmin ? 'true' : 'false');
          localStorage.setItem('user', JSON.stringify({
            cpf,
            nome: res.nome || '',
            email: res.email || '',
            curso: res.curso || '',
            unidadeEnsino: res.unidadeEnsino || ''
          }));
          navigate('/editais');
        } else {
          setErro('CPF ou senha inválidos.');
          localStorage.removeItem('isLogged');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('user');
        }
      })
      .catch((error) => {
        console.error('Erro no login:', error);
        setErro('Erro de conexão ao tentar entrar.');
      });
  }

  return (
    <main
      id="center"
      className="loginContainer"
    >
      <section className="login-card">
        <div className="login-header">
          <svg
            className="headerIcon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />

            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>

          <h1 className="sectionTitle">
            Portal de Intercâmbio
          </h1>
        </div>

        <p className="login-subtitle">
          Acesse com seu CPF e senha para ver
          os editais
        </p>

        <form
          onSubmit={handleSubmit}
          className="upload-form"
        >
          <div className="input-group">
            <label htmlFor="cpf">
              CPF
            </label>

            <input
              id="cpf"
              className="input-field"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) =>
                setCpf(e.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">
              Senha
            </label>

            <input
              id="senha"
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              required
            />
          </div>

          {erro && (
            <p className="status-message">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="botao"
          >
            <svg
              className="btnIcon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                ry="2"
              />

              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>

            Entrar
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login