import axios from "axios";
import { SubjectStaffPayload } from "../types/Datatypes.ts";
import { store } from "../store/store.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const SUBJECT_STAFF_ENDPOINT = API_URL + "/subject-staff/";

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

export const getAllSubjectStaff = async (limit: number, page: number, search: string) => {
  return axios.get(`${SUBJECT_STAFF_ENDPOINT}get-subjectstaff?limit=${limit}&page=${page}&search=${search}`, 
    getHeaders(),
  );
};

export const getSubjectStaffById = async (id: number) => {
  return axios.get(`${SUBJECT_STAFF_ENDPOINT}get-subjectstaff/${id}`, 
   getHeaders(),
  );
};

export const createSubjectStaff = async (data: SubjectStaffPayload) => {
  return axios.post(
    `${SUBJECT_STAFF_ENDPOINT}add-subjectstaff`,
    data,
    getHeaders(),
    
  );
};

export const updateSubjectStaff = async (id: number, data: SubjectStaffPayload) => {
  return axios.put(
    `${SUBJECT_STAFF_ENDPOINT}edit-subjectstaff/${id}`,data,
    getHeaders(),
    );
};

export const deleteSubjectStaff = async (id: number) => {
  return axios.delete(`${SUBJECT_STAFF_ENDPOINT}delete-subjectstaff/${id}`, getHeaders()
);
}