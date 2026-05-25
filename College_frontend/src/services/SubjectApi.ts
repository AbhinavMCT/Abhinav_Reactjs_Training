import axios from "axios";

import { SubjectPayload } from "../types/Datatypes.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const SUBJECT_ENDPOINT = API_URL + "/subject/";

const getAuthHeaders = () => ({
  "content-type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

export const getAllSubjects = async () => {
  return axios.get(`${SUBJECT_ENDPOINT}get-subjects`, {
    headers: getAuthHeaders()
  });
};

export const getSubjectById = async (id: number) => {
  return axios.get(`${SUBJECT_ENDPOINT}get-subjectby/${id}`, {
    headers: getAuthHeaders()
  });
};

export const createSubject = async (data: SubjectPayload) => {
  return axios.post(
    `${SUBJECT_ENDPOINT}add-subject`,
    data,
    {
      headers: getAuthHeaders()
    }
  );
};

export const updateSubject = async (id: number,data: SubjectPayload) => {
  return axios.put(
    `${SUBJECT_ENDPOINT}edit-subject/${id}`,
    data,
    {
      headers: getAuthHeaders()
    }
  );
};

export const deleteSubject = async (id: number) => {
  return axios.delete(
    `${SUBJECT_ENDPOINT}delete-subject/${id}`,
    {
      headers: getAuthHeaders()
    }
  );
};