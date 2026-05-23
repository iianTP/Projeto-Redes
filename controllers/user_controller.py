from models import *
import bcrypt, json

class UserController:
    def __init__(self):
        pass

    def login(self,req):
        '''
        Avalia login do cliente no sistema.

        req : Dicionário contendo o endpoint (str), o payload (str) e função de envio -> {'ep': endpoint, 'pl': payload, 'send': função}
        '''

        with open('data/usuarios.json') as f:
            users_dict = json.load(f)

        user = req['pl']['cpf']
        input = req['pl']['password'].encode('utf-8')

        response = {'valid': False, 'isAdmin': False}
        if user in users_dict:
            password = users_dict[user]['pw'].encode('utf-8')
            if bcrypt.checkpw(input,password):
                response['valid'] = True
                response['isAdmin'] = users_dict[user]['isAdmin']
        
        response = json.dumps(response).encode('utf-8')

        req['send'](response,'application/json',True)

