import axios from "axios";


export default axios.create({
    baseURL: import.meta.env.VITE_BASE_BACKEND_URL
})

export const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_BASE_BACKEND_URL + '/api',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})