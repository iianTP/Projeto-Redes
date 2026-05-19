import json
import os
from datetime import datetime
from socket import socket
from models import *
import pycountry

class FilesController:
    def __init__(self):
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
    
    def _openFile(self,path):
        try:
            with open(path, 'rb') as f:
                content = f.read()
            return content, True
        except FileNotFoundError:
            return None, False

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

    def _load_json(self, path, default):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return default

    def _save_json(self, path, data):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def listInstituicoes(self, req:dict):
        instituicoes = self._load_json('data/instituicoes.json', [])
        response = json.dumps(instituicoes).encode('utf-8')
        req['send'](response, 'application/json', True)

    def listCursos(self, req:dict):
        cursos = [
        "Medicina",
        "Odontologia",
        "Enfermagem",
        "Fisioterapia",
        "Nutrição",
        "Psicologia",
        "Educação Física",
        "Saúde Coletiva",
        "Terapia Ocupacional",
        "Engenharia Civil",
        "Engenharia Mecânica",
        "Engenharia Elétrica (eletrônica, telecomunicações, eletrotécnica)",
        "Engenharia da Computação",
        "Engenharia de Controle e Automação",
        "Engenharia de Software",
        "Sistemas de Informação",
        "Ciência da Computação",
        "Tecnologia em Logística",
        "Direito",
        "Administração",
        "Administração Pública EAD",
        "Serviço Social",
        "Ciências Sociais",
        "História",
        "Geografia",
        "Pedagogia",
        "Letras",
        "Ciências Biológicas",
        "Química",
        "Física"
        ]

        response = json.dumps(cursos).encode('utf-8')
        req['send'](response, 'application/json', True)

    def listPaises(self, req:dict):
        paises = [pais.name for pais in pycountry.Countries]
        response = json.dumps(paises).encode('utf-8')
        req['send'](response, 'application/json', True)

    def listEditais(self, req:dict):
        editais = self._load_json('data/editais.json', [])
        response = json.dumps(editais).encode('utf-8')
        req['send'](response, 'application/json', True)

    def cadastrarInstituicao(self, req:dict):
        payload = req.get('pl') or {}
        name = (payload.get('name') or '').strip()

        if not name:
            response = json.dumps({'success': False, 'error': 'Nome da instituição obrigatório'}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        instituicoes = self._load_json('data/instituicoes.json', [])
        if any(inst.get('name', '').lower() == name.lower() for inst in instituicoes):
            response = json.dumps({'success': False, 'error': 'Instituição já cadastrada'}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        instituicao = {'name': name, 'cadastrard_at': datetime.now().isoformat()}
        instituicoes.append(instituicao)
        self._save_json('data/instituicoes.json', instituicoes)

        response = json.dumps({'success': True, 'instituicao': instituicao}).encode('utf-8')
        req['send'](response, 'application/json', True)

    def cadastrarAluno(self, req:dict):
        payload = req.get('pl') or {}
        name = (payload.get('name') or '').strip()
        email = (payload.get('email') or '').strip()
        cpf = (payload.get('cpf') or '').strip()
        instituicao = (payload.get('instituicao') or '').strip()
        curso = (payload.get('curso') or '').strip()

        if not all([name, email, cpf, instituicao, curso]):
            response = json.dumps({'success': False, 'error': 'Todos os campos são obrigatórios'}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        alunos = self._load_json('data/alunos.json', [])
        if any(aluno.get('cpf') == cpf for aluno in alunos):
            response = json.dumps({'success': False, 'error': 'CPF já cadastrado'}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        aluno = {
            'name': name,
            'email': email,
            'cpf': cpf,
            'instituicao': instituicao,
            'curso': curso,
            'cadastrard_at': datetime.now().isoformat()
        }
        alunos.append(aluno)
        self._save_json('data/alunos.json', alunos)

        response = json.dumps({'success': True, 'aluno': aluno}).encode('utf-8')
        req['send'](response, 'application/json', True)

    def cadastrarEdital(self, req:dict):
        payload = req.get('pl') or {}
        instituicao = (payload.get('instituicao') or '').strip()
        pais = (payload.get('pais') or '').strip()
        cursos_aceitos = payload.get('cursos_aceitos') or []
        file_data = payload.get('pdf')

        if isinstance(cursos_aceitos, str):
            try:
                cursos_aceitos = json.loads(cursos_aceitos)
            except json.JSONDecodeError:
                cursos_aceitos = [cursos_aceitos]

        if not instituicao or not pais or not file_data or not file_data.get('content'):
            response = json.dumps({'success': False, 'error': 'Todos os campos obrigatórios devem ser preenchidos'}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        safe_name = os.path.basename(file_data.get('filename', 'edital.pdf'))
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        stored_name = f'{timestamp}_{safe_name}'
        storage_path = os.path.join('files', stored_name)

        try:
            os.makedirs(os.path.dirname(storage_path), exist_ok=True)
            with open(storage_path, 'wb') as f:
                f.write(file_data['content'])
        except Exception as exc:
            response = json.dumps({'success': False, 'error': str(exc)}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        editais = self._load_json('data/editais.json', [])
        entry = {
            'instituicao': instituicao,
            'pais': pais,
            'cursos_aceitos': cursos_aceitos,
            'original_filename': safe_name,
            'stored_filename': stored_name,
            'path': storage_path,
            'cadastrard_at': datetime.now().isoformat()
        }
        editais.append(entry)
        self._save_json('data/editais.json', editais)

        response = json.dumps({'success': True, 'edital': entry}).encode('utf-8')
        req['send'](response, 'application/json', True)

    def saveUpload(self, req:dict):
        payload = req.get('pl') or {}
        instituicao = (payload.get('instituicao') or '').strip()
        file_data = payload.get('file')

        if not instituicao or not file_data or not file_data.get('content'):
            response = json.dumps({'success': False, 'error': 'instituicao or file missing'}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        safe_name = os.path.basename(file_data.get('filename', 'upload.bin'))
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        stored_name = f'{timestamp}_{safe_name}'
        storage_path = os.path.join('files', stored_name)

        try:
            os.makedirs(os.path.dirname(storage_path), exist_ok=True)
            with open(storage_path, 'wb') as f:
                f.write(file_data['content'])
        except Exception as exc:
            response = json.dumps({'success': False, 'error': str(exc)}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        metadata_file = os.path.join('data', 'editais.json')
        try:
            existing = []
            if os.path.exists(metadata_file):
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
        except json.JSONDecodeError:
            existing = []

        entry = {
            'instituicao': instituicao,
            'original_filename': safe_name,
            'stored_filename': stored_name,
            'path': storage_path,
            'cadastrard_at': datetime.now().isoformat()
        }
        existing.append(entry)

        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(existing, f, indent=2, ensure_ascii=False)

        response = json.dumps({'success': True, 'stored_filename': stored_name}).encode('utf-8')
        req['send'](response, 'application/json', True)

    def getFiles(self,req:dict):
        '''
        Recebe a requisição e envia vários arquivos.

        req : Dicionário contendo o endpoint (str), o payload (str) e função de envio -> {'ep': endpoint, 'pl': payload, 'send': função}
        '''
        pass


