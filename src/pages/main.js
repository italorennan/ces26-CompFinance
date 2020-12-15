import React, { useState, useEffect } from 'react';
import { Header, Container, CenterSection, HintDiv } from './styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { XYPlot, LineMarkSeries, XAxis, YAxis, Hint } from 'react-vis';
import 'react-vis/dist/style.css';
import api from '../services/api';

const alpha = require('alphavantage')({ key: 'qweqweqwe' });

function Main() {
    // Hook de estado usado em toda a página
    const [state, setState] = useState({stockData: [],
        stock: {name: '', symbol: ''},
        historical: {'Meta Data': {'3. Last Refreshed': '0000-00-00'}},
        today: 1,
        delta: 1,
        percentage: 1,
        minDate: new Date((new Date(Date.now())).getFullYear(), (new Date(Date.now())).getMonth(), (new Date(Date.now())).getDate()-1),
        maxDate: new Date((new Date(Date.now())).getFullYear(), (new Date(Date.now())).getMonth(), (new Date(Date.now())).getDate()),
        data: [],
        labels: [],
        overGraph: false,
        timeScale: 'days',
        newStockName: '',
        newStockSymbol: '',
        error: false,
        control: false
    });

    // Efeito para atualizar lista de ações no banco de dados
    useEffect(() => {
        var stockObject = {};
        var stockList = [];

        async function getStocks() {
            await api.get('/stock/getAllStock')
            .then(res => {stockObject = res.data.stocks})
            .catch(error => console.log(error));

            const keys = Object.keys(stockObject);

            keys.map(function(key) {
                stockList.push(stockObject[key]);
            });

            setState({...state, stockData: stockList});
        }

        getStocks();
    }, [state.control]);

    // Função para atualização dos dados da ação escolhida
    async function updateStock(idx) {
        var newStock = state.stockData[idx];
        var newHistorical = {'Meta Data': {'3. Last Refreshed': '0000-00-00'}};
        var timeSeries = {};

        await alpha.data.daily(newStock.symbol).then(data => {
                newHistorical = data;
                timeSeries = data['Time Series (Daily)'];
            });

        const keys = Object.keys(timeSeries);

        const today = timeSeries[keys[0]]['4. close'];
        const yesterday = timeSeries[keys[1]]['4. close'];
        
        const delta = today - yesterday;
        const percentage = (delta / yesterday) * 100;

        setState({...state, stock: newStock, historical: newHistorical, today: today, delta: delta, percentage: percentage});
    }

    // Função para deletar ação da lista
    async function deleteStock(symbol) {
        await api.delete(`/stock/deleteStock?symbol=${symbol}`);

        setState({...state, control: !state.control});
    }

    // Função para adicionar ação ao banco de dados
    async function addStockDB() {
        const stockData = {
            name: state.newStockName,
            symbol: state.newStockSymbol
        };

        await api.post('/stock/createStock',
                JSON.stringify(stockData), { headers: {'Content-Type': 'application/json'} }
            );
    }

    // Função para adicionar nova ação à lista
    async function addStock() {
        var success = false;

        await alpha.data.daily(state.newStockSymbol)
        .then(data => {
            success = true;
        })
        .catch(err => {
            success = false;
        });

        if (success) {
            await addStockDB();
            document.getElementById('inputSymbol').value = '';
            document.getElementById('inputName').value = '';
            setState({...state, error: false, control: !state.control, newStockName: '', newStockSymbol: ''});
        }
        else
            setState({...state, error: true});
    }

    // Função para obter série temporal de valores da ação analisada
    async function getData(minDate, maxDate) {
        const timeDif = maxDate - minDate;
        const limitDaily = new Date(2020, 6, 1);

        var values = {};
        var newLabels = [];
        var newData = [];

        if (timeDif < 10368000000 && minDate > limitDaily) {
            await alpha.data.daily(state.stock.symbol).then(data => {
                values = data['Time Series (Daily)'];
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

            for (var j = 0; j < newData.length; j++)
                newData[j].x = j;

            setState({...state, minDate: minDate, maxDate: maxDate, data: newData, labels: newLabels, timeScale: 'monthly'});
        }
    }

    // Validação da data inicial do período escolhido
    const handleMinDate = (date: Date | null) => {
        const timeDif = state.maxDate - date;
        if (timeDif > 0) getData(date, state.maxDate);
    }

    // Validação da data final do período escolhido
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
                {state.stockData.map(function(stock, idx) {
                    return <div key={stock.symbol}>
                        <h4>{stock.symbol.toUpperCase()}</h4>
                        <h3>{stock.name}</h3>
                        <button onClick={() => deleteStock(stock.symbol)}>Deletar</button>
                        <br />
                    </div>;
                })}  
                <br />

                <h2>Seguir nova ação:</h2>
                <input id="inputSymbol" placeholder="Digite símbolo da ação" onChange={e => setState({...state, newStockSymbol: e.target.value.toLowerCase().replace('<', '\u003c').replace('>', '\u003e')})} />
                <input id="inputName" placeholder="Digite nome a ser atribuído" onChange={e => setState({...state, newStockName: e.target.value.replace('<', '\u003c').replace('>', '\u003e')})} />
                <button onClick={() => addStock()}>Seguir</button>

                {state.error ? 
                <h6>A ação selecionada não está disponível.</h6>
                : <></>}
            </Container>

            <Header>
                <h1>Painel de Acompanhamento</h1>
            </Header>
            <Container>
                <h2>Escolher ação:</h2>
                <select onChange={e => {if (e.target.value !== '') updateStock(parseInt(e.target.value))}}>
                    <option value=''></option>
                    {state.stockData.map(function(item, idx) {
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
                    <h4 style={{fontSize: '20px'}}>{state.today}</h4>
                    <h4>USD</h4>
                    {state.delta > 0 ? 
                    <h5 style={{color: 'green'}}>+{state.delta} ({state.percentage}%) ↑</h5> :
                    <h5 style={{color: 'red'}}>{state.delta} ({state.percentage}%) ↓</h5>}
                    <br />

                    <h2>Período de acompanhamento:</h2>
                    <br />
                    <CenterSection>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                label="Data inicial"
                                value={state.minDate} format="dd/MM/yyyy"
                                onChange={handleMinDate} disableFuture minDate={new Date(2000, 1, 1)}
                            />
                            <KeyboardDatePicker
                                variant="inline"
                                label="Data final"
                                value={state.maxDate} format="dd/MM/yyyy"
                                onChange={handleMaxDate} disableFuture minDate={state.minDate}
                            />
                        </MuiPickersUtilsProvider>
                    </CenterSection>

                    <CenterSection>
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
                    </CenterSection>
                </>}
            </Container>
        </>
    );
}

export default Main;