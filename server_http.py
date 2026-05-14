import socket
from files_controller import FilesController

class WebServer:
	def __init__(self):
		self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.fc = FilesController()
		self.exit = False
		self.endpoints = {
            'GET':[
                ('',       self.fc.getFile), # para carregamento html inicial ( GET / HTTP/1.1 )
                ('assets', self.fc.getFile), # para carregamento de assets da build (pode ser desnecessário depois)
                ('files',  self.fc.getFile)  # para envio INDIVIDUAL de arquivos da pasta 'files'
            ],
            'POST':[
				('shutdown', lambda: self.__setattr__('exit',True)) # fecha o servidor
			],
            'PUT':[],
            'DELETE':[]
        }

	def start(self):

		print(self.s)
		print(hex(id(self.s)))

		self.s.bind(('', 8080))
		self.s.listen(5)


		while not self.exit:
			ws, addr = self.s.accept()
			print('newsock', ws)
			print('add', addr)

			data = ws.recv(8192)
			P = data.split(b' ')
			method = P[0].decode()
			ep = P[1].decode().strip('/')

			for prefix,func in self.endpoints[method]:
				if ep.startswith(prefix):
					func({'ws':ws,'ep':ep})
					break
			ws.close()

		ws.close()
		self.s.close()

webserver = WebServer()
webserver.start()


