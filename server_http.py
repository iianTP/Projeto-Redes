import socket, json
from controllers.files_controller import FilesController
from controllers.user_controller import UserController

class WebServer:
	def __init__(self):
		self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.fc = FilesController()
		self.uc = UserController()
		self.exit = False

		self.pages = [
			'',
			'aaa'
		]

		self.endpoints = {
            'GET':[
                ('assets', self.fc.getFile), # para carregamento de assets da build
                ('files',  self.fc.getFile),  # para envio INDIVIDUAL de arquivos da pasta 'files'
            ],
            'POST':[
				('shutdown', lambda _: self.__setattr__('exit',True)), # fecha o servidor
				('login', self.uc.login)
			],
            'PUT':[],
            'DELETE':[]
        }

	def start(self):
		'''
		Inicializa o Web Server
		'''

		print(self.s)
		print(hex(id(self.s)))

		self.s.bind(('', 8080))
		self.s.listen(5)

		while not self.exit:
			ws, addr = self.s.accept()
			print('newsock', ws)
			print('add', addr)

			data = ws.recv(8192)
			print(data.decode())

			header, body = data.split(b'\r\n\r\n',1)
			payload = json.loads(body.decode('utf-8')) if len(body) > 0 else None
			print('\n',payload)

			P = header.split(b' ')

			method = P[0].decode()
			ep = P[1].decode().strip('/')

			req = {
				'ep': ep,
				'pl': payload,
				'send': lambda *args: self._send(ws,*args)
			}

			if ep in self.pages:
				req['ep'] = 'dist/index.html'
				self.fc.getFile(req)
			else:
				for prefix,func in self.endpoints[method]:
					if ep.startswith(prefix):
						func(req)
						break

			ws.close()

		ws.close()
		self.s.close()

	def _send(self,ws:socket.socket,content:bytes,mimetype:str,fileFound:bool):
		print(type(content),content)
		if fileFound:
			header = (
				f'HTTP/1.1 200 OK\r\n'
				f'Content-Type: {mimetype}\r\n'
				f'Content-Length: {len(content)}\r\n'
				'Access-Control-Allow-Origin: *\r\n\r\n'
			)
			ws.sendall(header.encode() + content)
		else:
			header = 'HTTP/1.1 404 Not Found\r\n\r\n'
			ws.sendall(header.encode())








webserver = WebServer()
webserver.start()


