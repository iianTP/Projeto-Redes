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
                ('admin/instituicoes', self.fc.listInstituicoes),
                ('admin/editais', self.fc.listEditais),
                #('admin/cursos', self.fc.listCursos),
                #('admin/unidades-ensino', self.fc.listUnidadesEnsino),
				('data',self.fc.getFile)
            ],
            'POST':[
				('shutdown', lambda _: self.__setattr__('exit',True)), # fecha o servidor
				('login', self.uc.login),
				('upload', self.fc.saveUpload),
				('admin/cadastrar-edital', lambda req: self.cc.cadastrar(req,'edital')),
				('admin/cadastrar-aluno', lambda req: self.cc.cadastrar(req,'aluno')),
				('admin/cadastrar-instituicao', lambda req: self.cc.cadastrar(req,'instituicao')),
			],
            'PUT':[],
            'DELETE':[]
        }

	def _parse_multipart(self, body: bytes, boundary: bytes):
		parts = body.split(b'--' + boundary)
		result = {}
		for part in parts:
			part = part.strip(b'\r\n')
			if not part or part == b'--':
				continue

			try:
				header, content = part.split(b'\r\n\r\n', 1)
			except ValueError:
				continue

			headers = {}
			for line in header.split(b'\r\n'):
				if b':' in line:
					key, value = line.split(b':', 1)
					headers[key.strip().lower()] = value.strip()

			disp = headers.get(b'content-disposition', b'').decode('utf-8', errors='ignore')
			meta = {}
			for item in disp.split(';'):
				item = item.strip()
				if '=' in item:
					k, v = item.split('=', 1)
					meta[k.strip()] = v.strip('"')

			name = meta.get('name')
			if not name:
				continue

			if 'filename' in meta:
				result[name] = {
					'filename': meta['filename'],
					'content': content
				}
			else:
				result[name] = content.decode('utf-8', errors='ignore')

		return result

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

			request = b''
			while b'\r\n\r\n' not in request:
				chunk = ws.recv(8192)
				if not chunk:
					break
				request += chunk

			if not request:
				ws.close()
				continue

			header, rest = request.split(b'\r\n\r\n', 1)
			print(header.decode(errors='ignore'))

			header_dict = self.getHeaderDict(header)
			print(header_dict)

			content_length: str = int(header_dict['Content-Length']) if 'Content-Length' in header_dict else 0
			content_type: str = header_dict['Content-Type'] if 'Content-Type' in header_dict else ''

			# for line in header.split(b'\r\n')[1:]:
			# 	lower_line = line.lower()
			# 	if lower_line.startswith(b'content-length:'):
			# 		try:
			# 			content_length = int(line.split(b':', 1)[1].strip())
			# 		except ValueError:
			# 			content_length = 0
			# 	elif lower_line.startswith(b'content-type:'):
			# 		content_type = line.split(b':', 1)[1].strip().decode('utf-8', errors='ignore')

			body = rest
			while len(body) < content_length:
				chunk = ws.recv(8192)
				if not chunk:
					break
				body += chunk

			payload = None
			if len(body) > 0:

				if content_type.startswith('application/json'):
					payload = json.loads(body.decode('utf-8'))

				elif content_type.startswith('multipart/form-data'):
					boundary = ''
					for part in content_type.split(';'):
						part = part.strip()
						if part.startswith('boundary='):
							boundary = part.split('=', 1)[1].encode('utf-8')
					if boundary:
						payload = self._parse_multipart(body, boundary)
					else:
						payload = None

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


			P = header.split(b' ')[0:3]

			method = P[0].decode()
			ep = P[1].decode().strip('/')

			req = {
				'ep': ep,
				'pl': payload,
				'send': lambda *args: self._send(ws,*args)
			}

			if method == 'OPicoes':
				header = (
					'HTTP/1.1 204 No Content\r\n'
					'Access-Control-Allow-Origin: *\r\n'
					'Access-Control-Allow-Methods: GET, POST, OPicoes\r\n'
					'Access-Control-Allow-Headers: Content-Type\r\n\r\n'
				)
				ws.sendall(header.encode())
				ws.close()
				continue

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
