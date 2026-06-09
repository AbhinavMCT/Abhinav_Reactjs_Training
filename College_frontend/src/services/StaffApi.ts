import axios from "axios";
import { RegisterPayload, UpdateProfilePayload } from "../types/Datatypes.ts";
import { store } from "../store/store.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const LOGIN_ENDPOINT = API_URL+"/staff/";

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

export const getstaffProfile = async() => {
    return await axios.get(LOGIN_ENDPOINT + "staffprofile",getHeaders());
};

export const registerStaff = async (formData: RegisterPayload) => {
    return await axios.post(LOGIN_ENDPOINT + "add-staff",formData,getHeaders());
};

export const getAllStaff = async (limit: number, page: number, search: string = "") => {
    return await axios.get(`${LOGIN_ENDPOINT}get-staffs?page=${page}&limit=${limit}&search=${search}`, getHeaders());
};

export const getStaffById = async (id: number) => {
    return await axios.get(LOGIN_ENDPOINT + `get-staff/${id}`, getHeaders());
};

export const deleteStaff = async (id: number) => {
    return await axios.delete(LOGIN_ENDPOINT + `delete-staff/${id}`,getHeaders());
};

export const updateProfile = async (formData: UpdateProfilePayload) => {
    return await axios.put(LOGIN_ENDPOINT + "edit-profile",formData,getHeaders());
};


export const updateStaff = async (id: number, formData: UpdateProfilePayload) => {
    return await axios.put(LOGIN_ENDPOINT + `edit-staff/${id}`,formData,getHeaders());
};
