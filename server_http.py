import socket, json
from controllers.files_controller import FilesController

class WebServer:
	def __init__(self):
		self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.fc = FilesController()
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
				('teste', self.fc.teste)
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
			print(payload, type(payload))

			P = header.split(b' ')

			method = P[0].decode()
			ep = P[1].decode().strip('/')

			if ep in self.pages:
				self.fc.getIndexHtml(ws)
			else:
				for prefix,func in self.endpoints[method]:
					if ep.startswith(prefix):
						func({'ws':ws,'ep':ep,'pl':payload})
						break

			ws.close()

		ws.close()
		self.s.close()

webserver = WebServer()
webserver.start()


