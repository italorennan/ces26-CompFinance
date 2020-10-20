import React, { useState } from 'react';
import GlobalContext from './context';
import Login from '../../sections/Main/Login';
import Home from '../../sections/Main/Home';
import api from '../../services/api';

function Main() {
    const [actualSection, setActualSection] = useState(0);

    const sections = [
        <Login />,
        <Home />
    ];

    return (
        <GlobalContext.Provider value={{ actualSection }}>
            {sections[actualSection]}
        </GlobalContext.Provider>
    );
}

export default Main;