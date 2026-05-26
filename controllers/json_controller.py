import json, os

class JsonController:

    def load_json(self, path, default=False):
        '''
        Carrega arquivo json.

        Retorna o json carregado e indicação de que o arquivo foi encontrado.

        path: Caminho do arquivo no servidor (str)
        default: Valor de retorno caso o arquivo não seja encontrado (any)
        '''
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f), True
        except (FileNotFoundError, json.JSONDecodeError):
            return default, False
        
    def save_json(self, path, data):
        '''
        Salva arquivo json no servidor.

        path: Caminho do novo arquivo no servidor (str)
        data: Arquivo
        '''
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def to_json(self,data,type='str'):
        '''
        Transforma dados em json.

        Retorna os dados transformados.

        path: Dados (any)
        type: Tipo de transformação (de string ou arquivo) (str)
        '''
        if type == 'str': return json.dumps(data).encode('utf-8')
        if type == 'file': return json.dump(data)
        