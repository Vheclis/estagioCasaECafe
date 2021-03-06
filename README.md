# estagioCasaECafe - Processo seletivo
Repositório dedicado aos códicos feitos para o processo seletivo da empresa [Casa e Café](https://www.casaecafe.com).
___
## Primera Etapa
Para a primeira etapa tinhamos que fazer uma API `RESTful`, com uma chamada `GET` para a rota com final `/plans` e uma chamada `POST` para uma rota com final `/payment`. **Fiz a escolha de o `price` ser calculado no backend, portanto não há campo `price` no body**.

Ambas as chamadas `GET` e `POST`  devem ser feitas em **`localhost:8080`**, sendo o fim da rota `/plans` para o `GET` e `/payment` para o `POST`.

### Exemplos de Input no [POSTMAN](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop)
 - Exemplo de configuração para fazer um POST:

   ![POST_exemple](https://i.imgur.com/K5jNYqf.png)

 - Exemplo de configuração para um GET:

   ![GET_exemple](https://i.imgur.com/BkXkLDw.png)

___
## Segunda Etapa

Para a segunda etapa nos foi pedido que criássemos uma `frontend` que consumisse a `API` que fizemos na primeira etapa.

Após rodar o servidor conforme uma das opções abaixo é possível acessar à `frontend` através do `localhost:8080`
___
## Terceira Etapa

Para a terceira etapa nos foi pedido a confecção de um arquivo de extenção `.pdf` analisando uma das telas da empresa, dizendo onde, como e por que nós usaríamos [Web Components](https://www.tableless.com.br/web-components-introducao/) naquele caso.

Esse arquivo pode ser encontrado na pasta **`terceira-dinamica`**, nele também há a minha opinião sobre o *Processo Seletivo* como um todo.
___


## Pré-requisitos
Caso opte por _não usar_ o **Docker** é necessário que tanto o **_[MongoDB](https://www.mongodb.com/)_** quanto o **_[Node.js](https://nodejs.org/en/)_** estejam instalados na máquina.

Ao escolher _usar_ o **Docker**, deve-se ter instalado tanto o **_[Docker](https://www.docker.com/)_** quanto o **_[Docker-Compose](https://docs.docker.com/compose/install/)_**.

## Rodando o app

Há duas formas de montar o app atualmente.
### **Usando docker**
 - Deve-se estar na pasta **root** do app;
 - **docker** deve estar rodando;
 - Deve-se inserir o seguinte comando no console:
```cmd
# docker-compose up -d
```

### **Não usando docker**
 - Deve-se estar na pasta **root** do app;
 - Mongo deve estar rodando na porta padrão;
 - Deve-se inserir o seguinte comando no console:
```cmd
# npm install
# npm run start
```
