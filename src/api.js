
const url = `http://${window.location.href.split('/')[2]}`;
const xhr = new XMLHttpRequest();

// GET
export const downloadFile = (path) => {

    xhr.open('GET', `${url}/${path}`, true);
    xhr.responseType = 'blob';

    xhr.onload = function() {
        if (this.status === 200) {
            const blob = this.response;
            const url = window.URL.createObjectURL(blob);
            window.open(url,'_blank');
        }
    };

    xhr.onerror = function() {
        console.error('Erro na conexão com o servidor');
    };

    xhr.send();

}

export const getData = (data) => {
    return new Promise((resolve,reject) => {
        xhr.open('GET', `${url}/data/${data}`, true);
        xhr.responseType = 'json';

        xhr.onload = function() {
            resolve(this.response);
        };

        xhr.onerror = function() {
            console.error('Erro na conexão com o servidor');
        };

        xhr.send();
    })

}

export const getEditais = () => {
    return new Promise((resolve,reject) => {
        xhr.open('GET', `${url}/data/editais.json`, true);
        xhr.responseType = 'json';

        xhr.onload = function() {
            resolve(this.response);
        };

        xhr.onerror = function() {
            console.error('Erro na conexão com o servidor');
        };

        xhr.send();
    })

}

// POST
export const shutdown = () => {
    xhr.open('POST', `${url}/shutdown`, true);
    xhr.send();
}

export const sendData = (path,data) => {
    return new Promise((resolve,reject) => {
        xhr.open('POST', `${url}/${path}`, true);
        xhr.responseType = 'json';

        xhr.onload = function() {
            if (!this.response.success) {
                console.log(this.response)
                reject(new Error(this.response.error))
            } else {
                resolve(this.response);
            }
        }

        xhr.send(JSON.stringify(data));
    })
}

export const login = ({cpf, password}) => {
    return new Promise((resolve,reject) => {
        xhr.open('POST', `${url}/login`, true);
        xhr.responseType = 'json';

        xhr.onload = function() {
            resolve(this.response);
        }

        xhr.send(JSON.stringify({cpf:cpf,password:password}));

    })


}