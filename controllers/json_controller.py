import json

class JsonController:

    def load_json(self, path, default=False):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return default
        
    def save_json(self, path, data):
        # os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def to_json(self,data,type='str'):
        if type == 'str': return json.dumps(data)
        if type == 'file': return json.dump(data)
        