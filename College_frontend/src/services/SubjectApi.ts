import axios from "axios";

import { SubjectPayload } from "../types/Datatypes.ts";
import { store } from "../store/store.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const SUBJECT_ENDPOINT = API_URL + "/subject/";

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

export const getAllSubjects = async (limit: number, page: number, search: string) => {
  return axios.get(`${SUBJECT_ENDPOINT}get-subjects?limit=${limit}&page=${page}&search=${search}`, getHeaders());
};

export const getSubjectById = async (id: number) => {
  return axios.get(`${SUBJECT_ENDPOINT}get-subjectby/${id}`, getHeaders());
};

export const createSubject = async (data: SubjectPayload) => {
  return axios.post(
    `${SUBJECT_ENDPOINT}add-subject`,
    data,
    getHeaders()
  );
};

export const updateSubject = async (id: number,data: SubjectPayload) => {
  return axios.put(
    `${SUBJECT_ENDPOINT}edit-subject/${id}`,
    data,
    getHeaders()
  );
};

export const deleteSubject = async (id: number) => {
  return axios.delete(
    `${SUBJECT_ENDPOINT}delete-subject/${id}`,
    getHeaders()
  );
};