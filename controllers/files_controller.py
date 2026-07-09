import json
import os
from datetime import datetime
from controllers.json_controller import JsonController
from db_connect import Database

class FilesController:
    def __init__(self):
        self.db = Database()
        self.jc = JsonController()
        self.content_types = {
            'html': 'text/html',
            'js':   'application/javascript',
            'css':  'text/css',
            'png':  'image/png',
            'jpg':  'image/jpeg',
            'json': 'application/json',
            'svg':  'image/svg+xml',
            'pdf':  'application/pdf'
        }

    def getFile(self,req:dict):
        '''
        Recebe a requisição e envia um arquivo único.

        req : Dicionário contendo o endpoint (str), o payload (str) e função de envio -> {'ep': endpoint, 'pl': payload, 'send': função}
        '''

        path: str = req['ep']
    
        ext = path.split('.')[-1]
        mimetype = self.content_types.get(ext, 'text/plain')

        if path.split('/')[0] in ['assets','icons.svg']:
            path = 'dist/'+path

        print(path)

        content, fileFound = self._openFile(path)

        req['send'](content, mimetype, fileFound)

    def saveUpload(self, req:dict):
        '''
        Salva arquivo no servidor.

        req : Dicionário contendo o endpoint (str), o payload (str) e função de envio -> {'ep': endpoint, 'pl': payload, 'send': função}
        '''

        payload = req['pl']

        filename = payload['filename']
        file = payload['file']

        with open(f'files/{filename}','wb') as f:
            f.write(file)

        res = self.jc.to_json({'success': True, 'msg': 'Arquivo salvo com sucesso.'})
        req['send'](res,'application/json',True)

    def _openFile(self,path):
        try:
            with open(path, 'rb') as f:
                content = f.read()
            return content, True
        except FileNotFoundError:
            return None, False

    def listarCandidaturas(self, req:dict):
        print(req)
        payload = req['pl']
        cpf_aluno = payload.get('cpf_aluno')

        candidaturas, _ = self.jc.load_json('data/candidaturas.json', [])
        editais, _ = self.jc.load_json('data/editais.json', [])

        if cpf_aluno:
            candidaturas = [c for c in candidaturas if str(c.get('cpf_aluno')) == str(cpf_aluno)]

        for candidatura in candidaturas:
            edital = next((e for e in editais.values() if str(e.get('id')) == str(candidatura.get('id_edital'))), None)
            candidatura['edital'] = edital

        response = json.dumps({'success': True, 'candidaturas': candidaturas}).encode('utf-8')
        req['send'](response, 'application/json', True)

    def criarCandidatura(self, req:dict):
        payload = req.get('pl') or {}
        cpf_aluno = payload.get('cpf_aluno')
        id_edital = payload.get('id_edital')
        documentos = payload.get('documentos') or []

        if isinstance(documentos, str):
            try:
                documentos = json.loads(documentos)
            except json.JSONDecodeError:
                documentos = [documentos]

        if not cpf_aluno or not id_edital:
            response = json.dumps({'success': False, 'error': 'CPF e Edital são obrigatórios.'}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        candidaturas, _ = self.jc.load_json('data/candidaturas.json', [])

        if any(str(c.get('cpf_aluno')) == str(cpf_aluno) and str(c.get('id_edital')) == str(id_edital) for c in candidaturas):
            response = json.dumps({'success': False, 'error': 'Você já se candidatou a este edital.'}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        candidatura = {
            'id': len(candidaturas) + 1,
            'cpf_aluno': cpf_aluno,
            'id_edital': id_edital,
            'data_candidatura': datetime.now().isoformat(),
            'status': 'pendente',
            'documentos': documentos
        }

        candidaturas.append(candidatura)
        self.jc.save_json('data/candidaturas.json', candidaturas)

        response = json.dumps({'success': True, 'candidatura': candidatura}).encode('utf-8')
        req['send'](response, 'application/json', True)

        

    