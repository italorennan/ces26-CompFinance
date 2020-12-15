import React, { useState } from 'react';
import { Container } from './styles';

function Login() {
    // Hook de estado para variáveis de login
    const [state, setState] = useState({
        user: '',
        password: ''
    });

    function handleChangePassword(password){
        
    }

    function handleChangeUser(user){

    }

    function handleLoginSubmit(){

    }

    return (
        <>
            <Container>
                <h1>Login</h1>

                <h2>Usuário:</h2>
                <input type="text" name="user"onChange={e=> handleChangeUser(e.target.value)} required/>
                <h2>Senha:</h2>
                <input type="password" name="password" onChange={e=>handleChangePassword(e.target.value)} required/>
                <input type="submit" value="Submit" onClick={e=>{e.preventDefault(); handleLoginSubmit();}}required/>
            </Container>
        </>
    );
}

export default Login;