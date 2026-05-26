import React, { useState } from 'react';
import { sendData } from '../src/api';

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

    const nomes_arquivos = arquivos.map(f => f.name);

    var info = {
      cpf_aluno: user.cpf,
      id_edital: edital.id,
      documentos: JSON.stringify(nomes_arquivos)
    }

    sendData('candidatura/criar',info)
    .then((res) => {
      setSucesso(true);
      setArquivos([]);
      setTimeout(() => {
        onClose();
        onSuccess && onSuccess();
      }, 1500);
    })
    .catch(() => setErro('Erro ao enviar candidatura'))
    .finally(() => setCarregando(false))

  };

  if (!isOpen) return null;
if (!user) return null;

return (
  <div className="modalOverlay" onClick={onClose}>
    <div className="modalContainer" onClick={(e) => e.stopPropagation()}>

      {/* Header */}
      <div className="modalHeader">
        <h3 className="modalTitulo">
          Candidatura - {edital?.titulo}
        </h3>

        <button className="modalCloseBtn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="modalForm">

        {/* Info do usuário */}
        <div className="modalInfoSection">
          <p className="modalInfoText">
            Nome: <strong>{user?.nome}</strong>
          </p>

          <p className="modalInfoText">
            Curso: <strong>{user?.curso}</strong>
          </p>

          <p className="modalInfoText">
            Email: <strong>{user?.email}</strong>
          </p>
        </div>

        {/* Upload */}
        <div className="modalFileSection">
          <label className="modalFileLabel">
            Anexar Documentos Necessários

            <input
              type="file"
              multiple
              onChange={handleArquivoChange}
              className="modalFileInput"
            />
          </label>

          {arquivos.length > 0 && (
            <div className="modalFileList">
              <p className="modalFilesCount">
                {arquivos.length} arquivo(s) selecionado(s):
              </p>

              <ul className="modalUl">
                {arquivos.map((file, index) => (
                  <li key={index} className="modalListItem">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Feedback */}
        {erro && <p className="modalErrorText">{erro}</p>}
        {sucesso && (
          <p className="modalSuccessText">
            Candidatura enviada com sucesso!
          </p>
        )}

        {/* Botões */}
        <div className="modalButtonGroup">
          <button
            type="button"
            className="modalCancelBtn"
            onClick={onClose}
            disabled={carregando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="modalSubmitBtn"
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
export default ModalCandidatura;
