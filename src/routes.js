import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main/index';
import Login from './pages/Main/login';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" render={() => <Login />}/>
                <Route path="/wallet" render={() => <Main />}/>
            </Switch>
        </BrowserRouter>
    );
}