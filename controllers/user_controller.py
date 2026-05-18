from models import *
import bcrypt, json

class UserController:
    def __init__(self):
        pass

    def login(self,req):

        with open('data/users.json') as f:
            users_dict = json.load(f)

        user = req['pl']['cpf']
        input = req['pl']['password'].encode('utf-8')

        response = {'valid': False}
        if user in users_dict:
            password = users_dict[user]['pw'].encode('utf-8')
            if bcrypt.checkpw(input,password):
                response['valid'] = True
        
        response = json.dumps(response).encode('utf-8')

        req['send'](response,'application/json',True)

