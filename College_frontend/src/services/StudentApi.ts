import axios from "axios";
import { RegisterPayload, UpdateProfilePayload } from "../types/Datatypes.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const LOGIN_ENDPOINT = API_URL+"/student/";

export const getProfile = async() => {
    console.log(localStorage.getItem("access"));
    return await axios.get(LOGIN_ENDPOINT + "profile",{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
            
        }
    });
};

export const registerStudent = async (formData: RegisterPayload) => {
    return await axios.post(LOGIN_ENDPOINT + "add-student",formData,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    });
};

export const getAllStudents = async () => {
    return await axios.get(LOGIN_ENDPOINT + "get-students",{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    });
};

export const getStudentById = async (id: number) => {
    return await axios.get(LOGIN_ENDPOINT + `get-student/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    });
};

export const deleteStudent = async (id: number) => {
    return await axios.delete(LOGIN_ENDPOINT + `delete-student/${id}`,{
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


export const updateStudents = async (id: number, formData: UpdateProfilePayload) => {
    return await axios.put(LOGIN_ENDPOINT + `edit-student/${id}`,formData,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    });
};
