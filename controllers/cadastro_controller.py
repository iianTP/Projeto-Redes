import json, datetime
from controllers.json_controller import JsonController

class CadastroController:
    def __init__(self):
        self.jc = JsonController()

        self.info = {
            'instituicao': {
                'id': 'nome',
                'json': 'data/instituicoes.json',
                'msg': 'Instituição cadastrada com sucesso.',
                'error': [
                    'Nome da instituição obrigatório',
                    'Instituição já cadastrada'
                ]
            },
            'aluno': {
                'id': 'cpf',
                'json': 'data/alunos.json',
                'msg': 'Aluno cadastrado com sucesso.',
                'error': [
                    'Todos os campos são obrigatórios',
                    'CPF já cadastrado'
                ]
            },
            'edital': {
                'id': 'titulo',
                'json': 'data/editais.json',
                'msg': 'Instituição cadastrada com sucesso.',
                'error': [
                    'Todos os campos são obrigatórios',
                    'Edital já cadastrado'
                ]
            }
        }

    def cadastrar(self,req,type):

        payload = req['pl']
        identifier = self.info[type]['id']
        json_path = self.info[type]['json']
        scc_msg = self.info[type]['msg']
        err_msgs = self.info[type]['error']

        data: dict = self.jc.load_json(json_path)
        response = self.jc.to_json({'success': True, 'msg': scc_msg})

        if not all([data[att] for att in data.keys()]):
            response = self.jc.to_json({'success': False, 'error': err_msgs[0]})
            req['send'](response, 'application/json', True)
            return
        
        if payload[identifier] in data:
            response = self.jc.to_json({'success':False, 'error': err_msgs[1]})
            req['send'](response,'application/json',True)
            return
        
        data[payload[identifier]] = payload
        data[payload[identifier]]['timestamp'] = datetime.datetime.now().isoformat()

        self.jc.save_json(json_path,data)
        
        req['send'](response,'application/json',True)
