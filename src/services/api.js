import axios from 'axios';

const api = axios.create({
    baseURL: "https://stormy-garden-64077.herokuapp.com/"
})

export default api;