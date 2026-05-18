from socket import socket
from models import *

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

        

            
    def getFiles(self,req:dict):
        '''
        Recebe a requisição e envia vários arquivos.

        req : Dicionário contendo o endpoint (str), o payload (str) e função de envio -> {'ep': endpoint, 'pl': payload, 'send': função}
        '''
        pass


