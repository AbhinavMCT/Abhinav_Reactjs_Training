import axios from "axios";
import { RegisterPayload, UpdateProfilePayload } from "../types/Datatypes.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const LOGIN_ENDPOINT = API_URL+"/staff/";

export const getProfile = async() => {
    console.log(localStorage.getItem("access"));
    return await axios.get(LOGIN_ENDPOINT + "profile",{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
            
        }
    });
};

export const registerStaff = async (formData: RegisterPayload) => {
    return await axios.post(LOGIN_ENDPOINT + "add-staff",formData,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    });
};

export const getAllStaff = async () => {
    return await axios.get(LOGIN_ENDPOINT + "get-staffs",{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    });
};

export const getStaffById = async (id: number) => {
    return await axios.get(LOGIN_ENDPOINT + `get-staff/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    });
};

export const deleteStaff = async (id: number) => {
    return await axios.delete(LOGIN_ENDPOINT + `delete-staff/${id}`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    });
};

export const updateProfile = async (formData: UpdateProfilePayload) => {
    return await axios.put(LOGIN_ENDPOINT + "edit-profile",formData,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    });
};


export const updateStaff = async (id: number, formData: UpdateProfilePayload) => {
    return await axios.put(LOGIN_ENDPOINT + `edit-staff/${id}`,formData,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    });
};
