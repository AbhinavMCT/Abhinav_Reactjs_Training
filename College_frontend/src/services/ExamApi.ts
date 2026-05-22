import axios from "axios";
import { ExamPayload } from "../types/Datatypes.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const EXAM_ENDPOINT = API_URL + "/exam/";

export const getAllExams = async () => {
  return axios.get(`${EXAM_ENDPOINT}get-exam`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
};

export const getExamById = async (id: number) => {
  return axios.get(`${EXAM_ENDPOINT}get-exambyid/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
};

export const createExam = async (data: ExamPayload) => {
  return axios.post(`${EXAM_ENDPOINT}add-exam`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
};

export const updateExam = async (
  id: number,
  data: ExamPayload
) => {
  return axios.put(`${EXAM_ENDPOINT}edit-exam/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
};

export const deleteExam = async (id: number) => {
  return axios.delete(`${EXAM_ENDPOINT}delete-exam/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
};