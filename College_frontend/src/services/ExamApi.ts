import axios from "axios";
import { Exam } from "../types/Datatypes.ts";
import { store } from "../store/store.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const EXAM_ENDPOINT = API_URL + "/exam/";

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

export const getAllExams = async (limit: number, page: number, search: string) => {
  return axios.get(`${EXAM_ENDPOINT}get-exam?limit=${limit}&page=${page}&search=${search}`, getHeaders());
};

export const getExamById = async (id: number) => {
  return axios.get(`${EXAM_ENDPOINT}get-exambyid/${id}`, getHeaders());
};

export const createExam = async (data: Exam) => {
  return axios.post(`${EXAM_ENDPOINT}add-exam`, data, getHeaders());
};

export const updateExam = async (id: number, data: Exam) => {
  return axios.put(`${EXAM_ENDPOINT}edit-exam/${id}`, data, getHeaders());
};

export const deleteExam = async (id: number) => {
  return axios.delete(`${EXAM_ENDPOINT}delete-exam/${id}`, getHeaders());
};

