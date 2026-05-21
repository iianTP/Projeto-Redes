import json, datetime
from controllers.json_controller import JsonController

class CadastroController:
    def __init__(self):
        self.jc = JsonController()

    
    def cadastrarInstituicao(self,req:dict):

        name = req['pl']['name']

        instituicoes = self.jc.load_json('data/instituicoes.json')
        res = self.jc.to_json({'success':True}).encode('utf-8')

        if not name:
            res = self.jc.to_json({'success':False,'error':'Nome da instituição obrigatório'}).encode('utf-8')
            req['send'](res,'application/json',True)
            return

        if name in instituicoes:
            res = self.jc.to_json({'success':False,'error':'Instituição já cadastrada'}).encode('utf-8')
            req['send'](res,'application/json',True)
            return

        instituicao = { name: {'timestamp': datetime.datetime.now().isoformat()} }
        instituicoes[name] = {'timestamp': datetime.datetime.now().isoformat()}  #.append(instituicao)
        self.jc.save_json('data/instituicoes.json',instituicoes)

        req['send'](res,'application/json',True)
