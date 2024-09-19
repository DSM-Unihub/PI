import axios from "axios";
import url from "./url.js";

const api = axios.create({
    baseURL: url
})

export default api