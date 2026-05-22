import axios from "axios";

import { SubjectPayload } from "../types/Datatypes.ts";

const API_URL = "import.meta.env.VITE_BackEndURL";
const SUBJECT_ENDPOINT = API_URL + "/subject/";

export const getAllSubjects = async () => {
  return axios.get(`${SUBJECT_ENDPOINT}get-subjects`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
};

export const getSubjectById = async (id: number) => {
  return axios.get(`${SUBJECT_ENDPOINT}get-subjectby/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
};

export const createSubject = async (
  data: SubjectPayload
) => {
  return axios.post(
    `${SUBJECT_ENDPOINT}add-subject`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    }
  );
};

export const updateSubject = async (
  id: number,
  data: SubjectPayload
) => {
  return axios.put(
    `${SUBJECT_ENDPOINT}edit-subject/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    }
  );
};

export const deleteSubject = async (id: number) => {
  return axios.delete(
    `${SUBJECT_ENDPOINT}delete-subject/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    }
  );
};