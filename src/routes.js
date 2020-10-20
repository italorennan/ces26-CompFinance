import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main/index';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" render={() => <Main />}/>
            </Switch>
        </BrowserRouter>
    );
}