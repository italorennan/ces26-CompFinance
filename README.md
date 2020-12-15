## [Front-end] CES-26: Projeto - CompFinance
Projeto front-end para visualizaçao do histórico de açoes cadastradas em um banco de dados.

### Tecnologias
Projeto desenvolvido com [React](https://reactjs.org) e com as seguintes dependências:
 - [Styled-components](https://styled-components.com/)
 - [React-Router-DOM](https://reacttraining.com/react-router/)
 - [Axios](https://github.com/axios/axios)
 - [Material-UI](https://material-ui.com/)

### Estrutura de pastas 
```js
- public
- src
    |- sections
    |- pages
    |- styles
    |- services
```

### Deploy da API
O deploy da API foi feito utilizando o [heroku](https://dashboard.heroku.com/) <br/>
O deploy do banco de dados foi feito utilizando o [Mongo Atlas](https://www.mongodb.com/cloud/atlas), plataforma construída em conjunto entre a Mongo e a AWS. <br/>
A API está disponível no link: https://cryptic-eyrie-86960.herokuapp.com/ <br/>
A princípio, para facilitar o acesso e teste da API, não estamos fazendo nenhuma restrição nos resquest. Em uma versão final deveríamos restringir o acess às rotas apenas à aplicação front-end da aplicação.


### Sobre o back-end
Back-end desenvolvido em [Node.js](https://nodejs.org/en/) com framework web [express](https://expressjs.com/pt-br/). É necessário ter o [Docker](docker.com) instalado em sua máquina - mais informações no [repositório](https://github.com/lulis123/ces26-back-end).

### Iniciando com o projeto
Verificar se existe [Node.js](https://nodejs.org/en/), [npm](https://www.npmjs.com/) e [yarn](https://yarnpkg.com/) instalados na sua máquina antes de iniciar com o projeto.
```bash
# Clone o repositório front-end
$ git clone https://github.com/italorennan/ces26-compfinance-front

# Entre no repositório
$ cd ces26-compfinance-front

# Instale as dependências que estão presentes no arquivo 'package.json'
$ npm install

# Clone o repositório back-end
$ git clone https://github.com/lulis123/ces26-back-end

# Depois de seguir as instruções de 'getting started' do back-end
# Entre no repositório
$ cd ces26-back-end

# Instale as dependências que estão presentes no arquivo 'package.json'
$ npm install

# Rode o projeto front-end
$ sudo npm start

# Rode o projeto back-end
$ sudo npm start
```

### Padrões de desenvolvimento do projeto
Criar uma nova branch `git checkout -b feat/nome-da-feature` sempre que for desenvolver uma nova funcionalidade.
> Nunca commitar na branch master.
