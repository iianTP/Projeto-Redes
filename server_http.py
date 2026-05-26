import socket, json
from controllers.files_controller import FilesController
from controllers.user_controller import UserController
from controllers.cadastro_controller import CadastroController

class WebServer:
	def __init__(self):
		self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.fc = FilesController()
		self.uc = UserController()
		self.cc = CadastroController()
		self.exit = False

		self.pages = [
			'',
			'admin',
			'aaa',
			'login',
			'editais'
		]

		self.endpoints = {
            'GET':[
                ('assets', self.fc.getFile), # para carregamento de assets da build
                ('files',  self.fc.getFile),  # para envio INDIVIDUAL de arquivos da pasta 'files'
				('data',self.fc.getFile)
            ],
            'POST':[
				('login', self.uc.login),
				('upload', self.fc.saveUpload),
				('candidatura/criar', self.fc.criarCandidatura),
				('candidatura/listar', self.fc.listarCandidaturas),
				('admin/cadastrar-edital', lambda req: self.cc.cadastrar(req,'edital')),
				('admin/cadastrar-aluno', lambda req: self.cc.cadastrar(req,'aluno')),
				('admin/cadastrar-instituicao', lambda req: self.cc.cadastrar(req,'instituicao')),
			],
            'PUT':[],
            'DELETE':[]
        }

	def getHeaderDict(self,header):
		h_dict: dict = {}
		for line in header.split(b'\r\n')[1:]:
				
			split_line = line.split(b':',1)
			key = split_line[0].strip().decode('utf-8', errors='ignore')
			value = split_line[1].strip().decode('utf-8', errors='ignore')

			h_dict[key] = value

		return h_dict

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

			request = ws.recv(8192)

			header, rest = request.split(b'\r\n\r\n', 1)
			print(header.decode(errors='ignore'))

			header_dict = self.getHeaderDict(header)

			content_type: str = header_dict['Content-Type'] if 'Content-Type' in header_dict else ''

			body = rest

			payload = None
			if len(body) > 0:

				if content_type.startswith('application/json'):
					payload = json.loads(body.decode('utf-8'))

				elif content_type.startswith('application/pdf'):
					payload = {
						'filename': header_dict['X-File-Name'],
						'file': body
					}

				else:
					try:
						payload = json.loads(body.decode('utf-8'))
					except json.JSONDecodeError:
						payload = body.decode('utf-8', errors='ignore')

			print('payload -----',payload)

			P = header.split(b' ')[0:3]

			method = P[0].decode()
			ep = P[1].decode().strip('/')

			req = {
				'ep': ep,
				'pl': payload,
				'send': lambda *args: self._send(ws,*args)
			}

			if method == 'GET' and not any(ep.startswith(prefix) for prefix,_ in self.endpoints['GET']):
				req['ep'] = 'dist/index.html'
				self.fc.getFile(req)
			else:
				for prefix,func in self.endpoints.get(method, []):
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
			header = (
				'HTTP/1.1 404 Not Found\r\n'
				'Access-Control-Allow-Origin: *\r\n\r\n'
			)
			ws.sendall(header.encode())

webserver = WebServer()
webserver.start()
