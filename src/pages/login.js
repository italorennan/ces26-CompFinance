import React, { useState } from 'react';
import { Container } from './styles';
import api from '../services/api';
import Context from './context';

function Login() {
    // Hook de estado para variáveis de login
    const [state, setState] = useState({
        username: '',
        password: ''
    });

    const { actualSection, setActualSection } = useContext(Context);

    // Função para enviar dados de login ao back
    async function enter() {
        const data = {
            username: state.username,
            password: state.password
        };

        // Chamar rota para envio dos dados
        await api.post('/login',
            JSON.stringify(data), { headers: {'Content-Type': 'application/json'} }
        ).then(response => {
            if (response.ok) setActualSection(1);
        }).catch(error => console.log(error));
    }

    return (
        <>
            <Container>
                <h1>Login</h1>

                <h2>Usuário:</h2>
                <input type="text" name="username" onChange={e => setState({...state, username: e.target.value.replace('<', '\u003c').replace('>', '\u003e')})}/>
                <br /><br />
                <h2>Senha:</h2>
                <input type="password" name="password" onChange={e => setState({...state, password: e.target.value.replace('<', '\u003c').replace('>', '\u003e')})} required/>
                <br /><br />
                <button onClick={() => enter()}>Entrar</button>
            </Container>
        </>
    );
}

export default Login;