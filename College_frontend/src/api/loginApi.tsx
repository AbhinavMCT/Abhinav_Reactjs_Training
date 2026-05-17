import axios from "axios";
import type { LoginCredentials, LoginResponse } from "../types/datatypes.tsx";

const API_URL = "http://localhost:3001";
const LOGIN_ENDPOINT = "/auth/login";

export const loginUser = async(creadentials: LoginCredentials) => {
    try{
        return await axios.post<LoginResponse>(API_URL + LOGIN_ENDPOINT, creadentials);
    }catch(error){
        console.error("Login failed:", error);
        throw error;
    }
};
