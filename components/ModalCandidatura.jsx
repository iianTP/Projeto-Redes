import React, { useState } from 'react';

function ModalCandidatura({ edital, isOpen, onClose, onSuccess }) {
  const [arquivos, setArquivos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleArquivoChange = (e) => {
    const files = Array.from(e.target.files || []);
    setArquivos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);
    setCarregando(true);

    if (!arquivos.length) {
      setErro('Por favor, selecione pelo menos um documento');
      setCarregando(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('cpf_aluno', user.cpf);
      formData.append('id_edital', edital.id);
      
      
      const nomes_arquivos = arquivos.map(f => f.name);
      formData.append('documentos', JSON.stringify(nomes_arquivos));

      const response = await fetch('http://127.0.0.1:8080/candidatura/criar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSucesso(true);
        setArquivos([]);
        setTimeout(() => {
          onClose();
          onSuccess && onSuccess();
        }, 1500);
      } else {
        setErro(data.error || 'Erro ao enviar candidatura');
      }
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro de conexão com o servidor');
    }

    setCarregando(false);
  };

  if (!isOpen) return null;
  if (!user) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.titulo}>Candidatura - {edital?.titulo}</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.infoSection}>
            <p style={styles.infoLabel}>Nome: <strong>{user?.nome}</strong></p>
            <p style={styles.infoLabel}>Curso: <strong>{user?.curso}</strong></p>
            <p style={styles.infoLabel}>Email: <strong>{user?.email}</strong></p>
          </div>

          <div style={styles.fileSection}>
            <label style={styles.fileLabel}>
              Anexar Documentos Necessários
              <input
                type="file"
                multiple
                onChange={handleArquivoChange}
                style={styles.fileInput}
              />
            </label>
            {arquivos.length > 0 && (
              <div style={styles.fileList}>
                <p style={styles.filesCount}>{arquivos.length} arquivo(s) selecionado(s):</p>
                <ul style={styles.ul}>
                  {arquivos.map((file, index) => (
                    <li key={index} style={styles.listItem}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {erro && <p style={styles.errorText}>{erro}</p>}
          {sucesso && <p style={styles.successText}>Candidatura enviada com sucesso!</p>}

          <div style={styles.buttonGroup}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={onClose}
              disabled={carregando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={carregando || !arquivos.length}
            >
              {carregando ? 'Enviando...' : 'Enviar Candidatura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
  },
  titulo: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f172a',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#64748b',
  },
  form: {
    padding: '24px',
  },
  infoSection: {
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  infoLabel: {
    margin: '8px 0',
    fontSize: '14px',
    color: '#334155',
  },
  fileSection: {
    marginBottom: '20px',
  },
  fileLabel: {
    display: 'block',
    padding: '24px',
    backgroundColor: '#f1f5f9',
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
  },
  fileInput: {
    display: 'none',
  },
  fileList: {
    marginTop: '12px',
  },
  filesCount: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 8px 0',
  },
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    fontSize: '13px',
    padding: '6px 0',
    color: '#334155',
    borderBottom: '1px solid #e2e8f0',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '13px',
    margin: '12px 0',
    padding: '8px 12px',
    backgroundColor: '#fee2e2',
    borderRadius: '4px',
  },
  successText: {
    color: '#16a34a',
    fontSize: '13px',
    margin: '12px 0',
    padding: '8px 12px',
    backgroundColor: '#dcfce7',
    borderRadius: '4px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#e2e8f0',
    color: '#334155',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#0f172a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default ModalCandidatura;
