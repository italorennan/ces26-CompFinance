import React, { useState } from 'react';
import { Header, Container, GraphSection, HintDiv } from './styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { XYPlot, LineMarkSeries, XAxis, YAxis, Hint } from 'react-vis';
import 'react-vis/dist/style.css';
import api from '../../services/api';

const alpha = require('alphavantage')({ key: 'qweqweqwe' });

// Substituir por GET ao db
const stockData = [
    {
        name: 'Apple',
        symbol: 'aapl'
    },
    {
        name: 'Amazon',
        symbol: 'amzn'
    },
    {
        name: 'Motorola',
        symbol: 'msi'
    }
];

function Main() {
    const [state, setState] = useState({stock: {name: '', symbol: ''},
        historical: {'Meta Data': {'3. Last Refreshed': '0000-00-00'}},
        minDate: new Date((new Date(Date.now())).getFullYear(), (new Date(Date.now())).getMonth(), (new Date(Date.now())).getDate()-1),
        maxDate: new Date((new Date(Date.now())).getFullYear(), (new Date(Date.now())).getMonth(), (new Date(Date.now())).getDate()),
        data: [],
        labels: [],
        overGraph: false,
        timeScale: 'days'
    });

    async function updateStock(idx) {
        var newStock = stockData[idx];
        var newHistorical = {'Meta Data': {'3. Last Refreshed': '0000-00-00'}};

        await alpha.data.monthly(newStock.symbol).then(data => {
                newHistorical = data;
            });

        setState({...state, stock: newStock, historical: newHistorical});
    }

    async function getData(minDate, maxDate) {
        const timeDif = maxDate - minDate;
        const limitDaily = new Date(2020, 6, 1);

        var values = {};
        var newLabels = [];
        var newData = [];

        if (timeDif < 10368000000 && minDate > limitDaily) {
            await alpha.data.daily(state.stock.symbol).then(data => {
                values = data['Time Series (Daily)'];
                console.log(values);
            });

            const keys = Object.keys(values);

            keys.forEach(function(key) {
                const year = parseInt(key.substr(0,4));
                const month = parseInt(key.substr(5,7)) - 1;
                const day = parseInt(key.substr(8,10));
                const date = new Date(year, month, day);
                
                if (date >= minDate && date <= maxDate) {
                    newLabels.unshift(key.substr(5,10));
                    newData.unshift({ x: 0, y: parseFloat(values[key]['4. close']) });
                }
            });

            for (var i = 0; i < newData.length; i++)
                newData[i].x = i;

            setState({...state, minDate: minDate, maxDate: maxDate, data: newData, labels: newLabels, timeScale: 'daily'});
        }
        else {
            await alpha.data.monthly(state.stock.symbol).then(data => {
                values = data['Monthly Time Series'];
            });
            console.log(values);
            const keys = Object.keys(values);

            keys.forEach(function(key) {
                const year = parseInt(key.substr(0,4));
                const month = parseInt(key.substr(5,7)) - 1;
                const day = parseInt(key.substr(8,10));
                const date = new Date(year, month, day);

                if (date >= minDate && date <= maxDate) {
                    newLabels.unshift(key.substr(0,7));
                    newData.unshift({ x: 0, y: parseFloat(values[key]['4. close']) });
                }
            });

            for (var i = 0; i < newData.length; i++)
                newData[i].x = i;

            setState({...state, minDate: minDate, maxDate: maxDate, data: newData, labels: newLabels, timeScale: 'monthly'});
        }
    }

    const handleMinDate = (date: Date | null) => {
        const timeDif = state.maxDate - date;
        if (timeDif > 0) getData(date, state.maxDate);
    }

    const handleMaxDate = (date: Date | null) => {
        const timeDif = date - state.minDate;
        if (timeDif > 0) getData(state.minDate, date);
    }

    return (
        <>
            <Header> 
                <h1>Ações Seguidas</h1>     
            </Header>
            <Container>
            </Container>

            <Header>
                <h1>Painel de Acompanhamento</h1>
            </Header>
            <Container>
                <h2>Escolher ação:</h2>
                <select onChange={e => {if (e.target.value !== '') updateStock(parseInt(e.target.value))}}>
                    <option value=''></option>
                    {stockData.map(function(item, idx) {
                        return <option key={item.name} value={idx}>{item.name}</option>
                    })}
                </select>

                {state.stock.name === '' ? <></> : <>
                    <br /><br />
                    <h1>{state.stock.symbol.toUpperCase()}</h1>

                    <h2>Data de referência:</h2>
                    <h3>{state.historical['Meta Data']['3. Last Refreshed']}</h3>
                    <br />

                    <h2>Valor:</h2>
                    <h4 style={{fontSize: '20px'}}>117.51</h4>
                    <h4>USD</h4>
                    <h5 style={{color: 'green'}}>+1.53 (1.32%) ↑</h5>
                    {/*<h5 style={{color: 'red}}>-1.53 (1.32%) ↓</h5>*/}
                    <br />

                    <h2>Período de acompanhamento:</h2>
                    <br />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            variant="inline"
                            label="Data inicial"
                            value={state.minDate}
                            onChange={handleMinDate} disableFuture minDate={new Date(2000, 1, 1)}
                        />
                        <KeyboardDatePicker
                            variant="inline"
                            label="Data final"
                            value={state.maxDate}
                            onChange={handleMaxDate} disableFuture minDate={state.minDate}
                        />
                    </MuiPickersUtilsProvider>

                    <GraphSection>
                        <XYPlot 
                            width={700} height={500} margin={{ left: 60, right: 60, bottom: 100 }}
                        >
                            <XAxis 
                                title={'Periodo'}
                                tickTotal={state.data.length} tickLabelAngle={-45}
                                tickFormat={v => state.labels[v]}
                                style={{ text: { stroke: 'none', fill: '#555555', fontWeight: 200 },
                                            line: { stroke: '#aaaaaa' } }}
                            />
                            <YAxis 
                                title={'Valor (USD)'}
                                style={{ text: { stroke: 'none', fill: '#555555', fontWeight: 200 },
                                            line: { stroke: '#aaaaaa' } }}
                            />
                            <LineMarkSeries 
                                className="series" data={state.data}
                                style={{ strokeWidth: '3px' }} size={2}
                                lineStyle={{ stroke: '#000066' }} markStyle={{ stroke: '#009999' }}
                                onValueMouseOver={d => setState({...state, overGraph: d})}
                                onValueMouseOut={d => setState({...state, overGraph: false})}
                            />
                            {state.overGraph &&
                            <Hint value={state.overGraph}>
                                <HintDiv>
                                    <p><span>Periodo:</span> {state.labels[state.overGraph.x]}</p>
                                    <p><span>Valor (USD):</span> {state.overGraph.y}</p>
                                </HintDiv>
                            </Hint>}
                        </XYPlot>
                    </GraphSection>
                </>}
            </Container>
        </>
    );
}

export default Main;