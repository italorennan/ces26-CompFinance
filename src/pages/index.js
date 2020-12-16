import React, { useState } from 'react';
import Context from './context';

import Main from './main';
import Login from './login';

function Page() {
    const [actualSection, setActualSection] = useState(0);

    const sections = [
        <Login />,
        <Main />
    ];

    return (
        <Context.Provider value={{ actualSection, setActualSection }}>
            {sections[actualSection]}
        </Context.Provider>
    )
}

export default Page;