
class CandidaturaModel:
    def __init__(self):
        self.id: str = 'default-id'
        self.status: str = ''
        self.docs: list = []

class EditalModel:
    def __init__(self):
        self.id: str = 'default-id'
        self.titulo: str = ''
        self.pdf: str = ''
        self.data_inicio: str = ''
        self.data_fim: str = ''

class UserModel:
    def __init__(self):
        self.id: str = 'default-id'
        self.nome: str = ''
        self.cpf: str = ''
        self.is_admin: bool = False

