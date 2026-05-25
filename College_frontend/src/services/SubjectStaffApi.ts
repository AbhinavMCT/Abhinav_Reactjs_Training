import axios from "axios";
import { SubjectStaffPayload } from "../types/Datatypes.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const SUBJECT_STAFF_ENDPOINT = API_URL + "/subject-staff/";

const getAuthHeaders = () => ({
  "content-type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

export const getAllSubjectStaff = async () => {
  return axios.get(`${SUBJECT_STAFF_ENDPOINT}get-subjectstaff`, {
    headers: getAuthHeaders(),
  });
};

export const getSubjectStaffById = async (id: number) => {
  return axios.get(`${SUBJECT_STAFF_ENDPOINT}get-subjectstaff/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const createSubjectStaff = async (data: SubjectStaffPayload) => {
  return axios.post(
    `${SUBJECT_STAFF_ENDPOINT}add-subjectstaff`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );
};

export const updateSubjectStaff = async (id: number, data: SubjectStaffPayload) => {
  return axios.put(
    `${SUBJECT_STAFF_ENDPOINT}edit-subjectstaff/${id}`,data,
    {headers: getAuthHeaders(),}
    );
};

export const deleteSubjectStaff = async (id: number) => {
  return axios.delete(`${SUBJECT_STAFF_ENDPOINT}delete-subjectstaff/${id}`, {
    headers: getAuthHeaders(),
  });
}