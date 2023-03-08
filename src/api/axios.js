import axios from "axios";

export default axios.create({
    baseURL: 'http://localhost:5000'
})

export const axiosPrivate = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})