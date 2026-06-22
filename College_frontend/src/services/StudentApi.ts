import { RegisterPayload, UpdateProfilePayload } from "../types/Datatypes.ts";
import api from "../interceptor.ts";

const LOGIN_ENDPOINT = "/student/";



export const getProfile = async() => {
    return await api.get(LOGIN_ENDPOINT + "profile",);
};

export const getStudents = (
  page: number,
  limit: number
) => {
  return api.get(
    `${LOGIN_ENDPOINT}students?page=${page}&limit=${limit}`,
  );
};

export const registerStudent = async (formData: RegisterPayload) => {
    return await api.post(LOGIN_ENDPOINT + "add-student",formData,);
};

export const getAllStudents = async (page: number, limit: number, search: string) => {
    return await api.get(`${LOGIN_ENDPOINT}get-students?page=${page}&limit=${limit}&search=${search}`, );
};

export const getStudentById = async (id: number) => {
    return await api.get(LOGIN_ENDPOINT + `get-student/${id}`, );
};

export const deleteStudent = async (id: number) => {
    console.log(`${LOGIN_ENDPOINT}/delete-student/${id}`);
    return await api.delete(LOGIN_ENDPOINT + `delete-student/${id}`,);
};

export const updateProfile = async (formData: UpdateProfilePayload) => {
    return await api.put(LOGIN_ENDPOINT + "edit-profile",formData,);
};


export const updateStudents = async (id: number, formData: UpdateProfilePayload) => {
    return await api.put(LOGIN_ENDPOINT + `edit-student/${id}`,formData,);
};

export const importStudents = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/import-students",formData,{
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};
