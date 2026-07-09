import mysql.connector,json
from controllers.json_controller import JsonController

class Database:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self.connect_db()

    def connect_db(self):
        if self.conn is None:
            try:
                self.conn = mysql.connector.connect(
                    host='localhost',
                    user='root',
                    password='123456',
                    database='projetobd',
                    autocommit=True
                )
                self.cursor = self.conn.cursor(dictionary=True)
            except Exception:
                self.conn = None

    def insert(self,table:str,data:list,columns:list[str]=[]):
        
        q_data = '(' + f'{data}'.strip('[]') + ')'
        q_columns = '('+','.join(columns)+')' if columns else ''

        try:
            self.cursor.execute(f'INSERT INTO {table} {q_columns} VALUES {q_data}')
        except Exception as e:
            print(e)

    def update(self,table:str,column:str,value:str,cond:str='1=1'):
        try:
            self.cursor.execute(f'UPDATE TABLE {table} SET {column} = {value} WHERE {cond}')
        except Exception as e:
            print(e)

    def get_query_data(self,query_file:str,send,condition:str=''):

        query = ''
        with open(f'queries/{query_file}.sql','r') as q:
            query = q.read()

        if condition: query = query.replace(';',' where cpf = '+condition+';')

        if query:
            self.cursor.execute(query)
            data = self.cursor.fetchall()
            res = JsonController().to_json(data)
            send(res,'application/json',True)
        


    

    

    


