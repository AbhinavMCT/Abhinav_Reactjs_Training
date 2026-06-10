// import axios from "axios";
import { Exam } from "../types/Datatypes.ts";
// import { store } from "../store/store.ts";
import api from "../interceptor.ts";

// const API_URL = import.meta.env.VITE_BackEndURL;
const EXAM_ENDPOINT =   "/exam/";

// const getHeaders = () => {
//   const token =
//     store.getState().auth.token || localStorage.getItem("access");
//     console.log(token);
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

export const getAllExams = async (limit: number, page: number, search: string) => {
  return api.get(`${EXAM_ENDPOINT}get-exam?limit=${limit}&page=${page}&search=${search}`, );
};

export const getExamById = async (id: number) => {
  return api.get(`${EXAM_ENDPOINT}get-exambyid/${id}`, );
};

export const createExam = async (data: Exam) => {
  return api.post(`${EXAM_ENDPOINT}add-exam`, data, );
};

export const updateExam = async (id: number, data: Exam) => {
  return api.put(`${EXAM_ENDPOINT}edit-exam/${id}`, data, );
};

export const deleteExam = async (id: number) => {
  return api.delete(`${EXAM_ENDPOINT}delete-exam/${id}`, );
};

