import socket

class ProcessController:
    def __init__(self):
        self.ws = None
        self.addr = None
        self.exit = False
        self.P = None
        self.request_types = {
            'GET':     self.ProcessGet,
            'POST':    self.ProcessPost,
            'PUT':     self.ProcessPut,
            'DELETE':  self.ProcessDelete,
            'OPTIONS': self.ProcessOptions
        }

    def Process(self,ws,addr):
        self.ws = ws
        self.addr = addr
        data = self.ws.recv(8192)
        self.P = data.split(b' ') # GET / HTTP/1.0 -> [GET, /, HTTP/1.0]
        self.request_types[self.P[0].decode()]()



    def ProcessGet(self):


        path = self.P[1].decode().strip('/')

        if path == '':
            path += 'index.html'
        
        content_types = {
            'html': 'text/html',
            'js':   'application/javascript',
            'css':  'text/css',
            'png':  'image/png',
            'jpg':  'image/jpeg',
            'json': 'application/json',
            'svg':  'image/svg+xml',
            'pdf':  'application/pdf'
        }
        
        ext = path.split('.')[-1]
        mimetype = content_types.get(ext, 'text/plain')

        if path.split('/')[0] in ['assets','src','index.html','icons.svg']:
            path = 'dist/'+path


        print(path)
        try:
            with open(path, 'rb') as f:
                conteudo = f.read()
            
            header = f'HTTP/1.1 200 OK\r\nContent-Type: {mimetype}\r\nContent-Length: {len(conteudo)}\r\nAccess-Control-Allow-Origin: *\r\n\r\n'
            self.ws.sendall(header.encode() + conteudo)
        except FileNotFoundError:
            header = 'HTTP/1.1 404 Not Found\r\n\r\n'
            self.ws.sendall(header.encode())


    def ProcessPost(self):
        self.exit = True
        
    def ProcessPut(self):
        pass
    def ProcessDelete(self):
        pass

    def ProcessOptions(self):
        resp = (
            'HTTP/1.1 204 No Content\r\n'
            'Access-Control-Allow-Origin: *\r\n'
            'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n'
            'Access-Control-Allow-Headers: Content-Type\r\n'
            'Connection: keep-alive\r\n\r\n'
        )
        print(self.P)
        self.ws.sendall(resp.encode())