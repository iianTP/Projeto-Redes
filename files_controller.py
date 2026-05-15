from socket import socket

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

    def getFile(self,req:dict):
        '''
        Recebe a requisição e envia um arquivo único.

        req : Dicionário contendo ws (socket) e o endpoint (str) -> {'ws': ws,'ep': ep}
        '''

        ws: socket = req['ws']
        path = req['ep']

        if path == '':
            path += 'index.html'
    
        ext = path.split('.')[-1]
        mimetype = self.content_types.get(ext, 'text/plain')

        if path.split('/')[0] in ['assets','index.html','icons.svg']:
            path = 'dist/'+path


        print(path)
        try:
            with open(path, 'rb') as f:
                conteudo = f.read()
            
            header = (
                'HTTP/1.1 200 OK\r\n'
                f'Content-Type: {mimetype}\r\n'
                f'Content-Length: {len(conteudo)}\r\n'
                'Access-Control-Allow-Origin: *\r\n\r\n'
            )
            ws.sendall(header.encode() + conteudo)
        except FileNotFoundError:
            header = 'HTTP/1.1 404 Not Found\r\n\r\n'
            ws.sendall(header.encode())
            
    def getFiles(self,req:dict):
        '''
        Recebe a requisição e envia vários arquivos.

        req : Dicionário contendo ws (socket) e o endpoint (str) -> {'ws': ws,'ep': ep}
        '''
        pass
