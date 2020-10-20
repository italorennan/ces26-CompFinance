import React, { useState } from 'react';
import api from '../../services/api';

const alpha = require('alphavantage')({ key: 'qweqweqwe' });

function Main() {
    alpha.data.monthly('aapl').then(data => {
        console.log(data);
    });

    return (
        <h1>Esse é um teste.</h1>
    );
}

export default Main;