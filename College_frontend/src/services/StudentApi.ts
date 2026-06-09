import axios from "axios";
import { RegisterPayload, UpdateProfilePayload } from "../types/Datatypes.ts";
import { store } from "../store/store.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const LOGIN_ENDPOINT = API_URL+"/student/";

const getHeaders = () => {
  const token =
    store.getState().auth.token || localStorage.getItem("access");
    console.log(token);
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getProfile = async() => {
    return await axios.get(LOGIN_ENDPOINT + "profile",getHeaders());
};

export const getStudents = (
  page: number,
  limit: number
) => {
  return axios.get(
    `${LOGIN_ENDPOINT}students?page=${page}&limit=${limit}`,getHeaders()
  );
};

export const registerStudent = async (formData: RegisterPayload) => {
    return await axios.post(LOGIN_ENDPOINT + "add-student",formData,getHeaders());
};

export const getAllStudents = async (page: number, limit: number, search: string) => {
    return await axios.get(`${LOGIN_ENDPOINT}get-students?page=${page}&limit=${limit}&search=${search}`, getHeaders());
};

export const getStudentById = async (id: number) => {
    return await axios.get(LOGIN_ENDPOINT + `get-student/${id}`, getHeaders());
};

export const deleteStudent = async (id: number) => {
    console.log(`${LOGIN_ENDPOINT}/delete-student/${id}`);
    return await axios.delete(LOGIN_ENDPOINT + `delete-student/${id}`,getHeaders());
};

export const updateProfile = async (formData: UpdateProfilePayload) => {
    return await axios.put(LOGIN_ENDPOINT + "edit-profile",formData,getHeaders());
};


export const updateStudents = async (id: number, formData: UpdateProfilePayload) => {
    return await axios.put(LOGIN_ENDPOINT + `edit-student/${id}`,formData,getHeaders());
};
