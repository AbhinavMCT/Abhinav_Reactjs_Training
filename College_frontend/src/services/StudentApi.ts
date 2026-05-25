import axios from "axios";
import { RegisterPayload, UpdateProfilePayload } from "../types/Datatypes.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const LOGIN_ENDPOINT = API_URL+"/student/";

const getHeaders = () => ({
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});

export const getProfile = async() => {
    return await axios.get(LOGIN_ENDPOINT + "profile",getHeaders());
};

export const registerStudent = async (formData: RegisterPayload) => {
    return await axios.post(LOGIN_ENDPOINT + "add-student",formData,getHeaders());
};

export const getAllStudents = async () => {
    return await axios.get(LOGIN_ENDPOINT + "get-students",getHeaders());
};

export const getStudentById = async (id: number) => {
    return await axios.get(LOGIN_ENDPOINT + `get-student/${id}`, getHeaders());
};

export const deleteStudent = async (id: number) => {
    return await axios.delete(LOGIN_ENDPOINT + `delete-student/${id}`,getHeaders());
};

export const updateProfile = async (formData: UpdateProfilePayload) => {
    return await axios.put(LOGIN_ENDPOINT + "edit-profile",formData,getHeaders());
};


export const updateStudents = async (id: number, formData: UpdateProfilePayload) => {
    return await axios.put(LOGIN_ENDPOINT + `edit-student/${id}`,formData,getHeaders());
};
