import axios from 'axios';

const api = axios.create({
    baseURL: "https://ces26-back.herokuapp.com/"
})

export default api;