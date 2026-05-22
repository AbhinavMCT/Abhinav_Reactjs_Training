import axios from "axios";
import type { LoginCredentials, LoginResponse } from "../types/Datatypes.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const LOGIN_ENDPOINT = "/auth/login";

export const loginUser = async(creadentials: LoginCredentials) => {
    try{
        return await axios.post<LoginResponse>(API_URL + LOGIN_ENDPOINT, creadentials);
    }catch(error){
        console.error("Login failed:", error);
        throw error;
    }
};
