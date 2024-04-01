import axios from "axios";

export const axiosSsbClient = axios.create({
    baseURL: 'https://data.ssb.no/api/v0/en/table' 
})