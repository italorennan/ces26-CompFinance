import React, { useState } from 'react';
import { Container } from './styles';

function Login() {
    // Hook de estado para variáveis de login
    const [state, setState] = useState({
        user: '',
        password: ''
    });

    return (
        <>
            <Container>
                <h1>Login</h1>

                <form action="https://ces26-back.herokuapp.com/login" method="post">
                    <h2>Usuário:</h2>
                    <input type="text" name="username"/>
                    <h2>Senha:</h2>
                    <input type="password" name="password" required/>
                    <input class="submit-btn" type="submit" value="Submit" required/>
                </form>
            </Container>
        </>
    );
}

export default Login;