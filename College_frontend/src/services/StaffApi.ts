import { RegisterPayload, UpdateProfilePayload } from "../types/Datatypes.ts";
import api from "../interceptor.ts"
const LOGIN_ENDPOINT = "/staff/";



export const getstaffProfile = async() => {
    return await api.get(LOGIN_ENDPOINT + "staffprofile",);
};

export const registerStaff = async (formData: RegisterPayload) => {
    return await api.post(LOGIN_ENDPOINT + "add-staff",formData,);
};

export const getAllStaff = async (limit: number, page: number, search: string = "") => {
    return await api.get(`${LOGIN_ENDPOINT}get-staffs?page=${page}&limit=${limit}&search=${search}`,);
};

export const getStaffById = async (id: number) => {
    return await api.get(LOGIN_ENDPOINT + `get-staff/${id}`,);
};

export const deleteStaff = async (id: number) => {
    return await api.delete(LOGIN_ENDPOINT + `delete-staff/${id}`,);
};

export const updateProfile = async (formData: UpdateProfilePayload) => {
    return await api.put(LOGIN_ENDPOINT + "edit-profile",formData,);
};


export const updateStaff = async (id: number, formData: UpdateProfilePayload) => {
    return await api.put(LOGIN_ENDPOINT + `edit-staff/${id}`,formData,);
};
