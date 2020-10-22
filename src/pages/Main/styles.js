import styled from 'styled-components';

export const Header = styled.div`
    width: 100%;
    height: 100%;
    padding: 5px 0;
    max-width: 1280px;
    background-color: #767676;
    border-radius: 15px 15px 0 0;
    
    h1 {
        text-align: center;
        font-size: 25px;
        color: white;
    }
`;

export const Container = styled.div`
    width: 100%;
    height: 100%;
    padding: 10px;
    max-width: 1280px;
    background-color: #efefef;
    border-radius: 0 0 15px 15px;
    margin-bottom: 30px;

    h1 {
        text-align: center;
        font-size: 20px;
        color: #aa9f36;
    }

    h2 {
        margin-right: 0;
        font-size: 16px;
        color: #121212;
        display: inline-block;
    }

    h3 {
        font-size: 16px;
        color: #565656;
        display: inline-block;
    }

    h4 {
        font-size: 16px;
        font-weight: 900;
        color: #10277f;
        display: inline-block;
    }

    h5 {
        margin-left: 25px;
        font-size: 16px;
        color: #1f971e;
        display: inline-block;
    }

    h6 {
        font-size: 10px;
        color: red;
    }

    select {
        margin-left: 5px;
        font-family: Montserrat;
        font-size: 14px;
    }
`;

export const CenterSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-block-start: 0em;
    margin-block-end: 0em;
    align-items: center;
`;

export const HintDiv = styled.div`
    background-color: #555555;
    color: #dddddd;
    border: #777777;
    border-radius: 0.5em;
    padding: 0.2em;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    p {
        font-size: 0.8em;
    }

    span {
        font-weight: 900;
    }
`;