import axios from "axios";

const API = axios.create({
    baseURL: "https://insurance-claim-backend-50yt.onrender.com"
});

API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    console.log("TOKEN FROM LOCAL STORAGE:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API;