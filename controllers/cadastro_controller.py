import datetime, bcrypt
from controllers.json_controller import JsonController
from db_connect import Database

class CadastroController:
    def __init__(self):
        self.jc = JsonController()
        self.db = Database()

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

    def sendError(self,req,msg):
        '''
        Envia mensagem de erro para o cliente.

        req : Dicionário contendo o endpoint (str), o payload (str) e função de envio -> {'ep': endpoint, 'pl': payload, 'send': função}
        msg: Mensagem de erro (str)
        '''
        response = self.jc.to_json({'success':False, 'error': msg})
        req['send'](response,'application/json',True)

    def cadastrar(self,req,type):
        '''
        Cadastra alunos, editais e instituições.

        req : Dicionário contendo o endpoint (str), o payload (str) e função de envio -> {'ep': endpoint, 'pl': payload, 'send': função}
        type: Tipo do cadastro (str) -> 'aluno', 'edital' ou 'instituicao'
        '''

        payload = req['pl']
        identifier = self.info[type]['id']
        json_path = self.info[type]['json']
        scc_msg = self.info[type]['msg']
        err_msgs = self.info[type]['error']

        data, fileFound = self.jc.load_json(json_path)
        response = self.jc.to_json({'success': True, 'msg': scc_msg, 'pw': '12345'})

        if not fileFound:
            self.sendError(req,'Falha ao encontrar dados')
            return

        if not all([data[att] for att in data.keys()]):
            self.sendError(req,err_msgs[0])
            return
        
        if payload[identifier] in data:
            self.sendError(req,err_msgs[1])
            return
        
        data[payload[identifier]] = payload
        data[payload[identifier]]['timestamp'] = datetime.datetime.now().isoformat()


        self.jc.save_json(json_path,data)

        if type == 'aluno':
            self.createUser(payload['cpf'])


            pw = bcrypt.hashpw('12345'.encode('utf-8'),bcrypt.gensalt()).decode()

            data = (payload['cpf'], payload['nome'], 1.23, 1, payload['email'], payload['instituicao'], pw)

            self.db.insert('aluno',data)
        
        req['send'](response,'application/json',True)

    def createUser(self,cpf):

        users,_ = self.jc.load_json('data/usuarios.json')
        
        users[cpf] = {
            'pw':bcrypt.hashpw('12345'.encode('utf-8'),bcrypt.gensalt()).decode(),
            'isAdmin': False
        }

        self.jc.save_json('data/usuarios.json',users)
    


