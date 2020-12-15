import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Page from './pages/index';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" render={() => <Page />} />
            </Switch>
        </BrowserRouter>
    );
}