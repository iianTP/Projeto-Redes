import json, datetime
from controllers.json_controller import JsonController

class CadastroController:
    def __init__(self):
        self.jc = JsonController()

    
    def cadastrarInstituicao(self,req:dict):

        name = req['pl']['name']

        instituicoes = self.jc.load_json('data/instituicoes.json')
        res = self.jc.to_json({'success':True, 'msg': 'Instituição cadastrada com sucesso.'}).encode('utf-8')

        if not name:
            res = self.jc.to_json({'success':False,'error':'Nome da instituição obrigatório'}).encode('utf-8')
            req['send'](res,'application/json',True)
            return

        if name in instituicoes:
            res = self.jc.to_json({'success':False,'error':'Instituição já cadastrada'}).encode('utf-8')
            req['send'](res,'application/json',True)
            return

        instituicoes[name] = {'timestamp': datetime.datetime.now().isoformat()}  #.append(instituicao)
        self.jc.save_json('data/instituicoes.json',instituicoes)

        req['send'](res,'application/json',True)

    def cadastrarAluno(self,req:dict):

        aluno: dict = req['pl']
        response = {'success': True, 'msg': 'Aluno cadastrado com sucesso.'}

        if not all([aluno[att] for att in aluno.keys()]):
            response = json.dumps({'success': False, 'error': 'Todos os campos são obrigatórios'}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return

        alunos = self.jc.load_json('data/alunos.json', [])
        if aluno['cpf'] in alunos:
            response = json.dumps({'success': False, 'error': 'CPF já cadastrado'}).encode('utf-8')
            req['send'](response, 'application/json', True)
            return
        
        alunos[aluno['cpf']] = aluno # trocar chave "aluno['cpf']" por um ID depois
        alunos[aluno['cpf']]['timestamp'] = datetime.datetime.now().isoformat()

        self.jc.save_json('data/alunos.json',alunos)
        req['send'](self.jc.to_json(response).encode('utf-8'), 'application/json', True)

    def cadastrarEdital(self,req:dict):
        pass