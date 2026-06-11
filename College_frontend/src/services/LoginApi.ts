import type { LoginCredentials, LoginResponse } from "../types/Datatypes.ts";
import api from "../interceptor.ts";

const LOGIN_ENDPOINT = "/auth/login";

export const loginUser = async(creadentials: LoginCredentials) => {
    try{
        return await api.post<LoginResponse>(LOGIN_ENDPOINT, creadentials);
    }catch(error){
        console.error("Login failed:", error);
        throw error;
    }
};
