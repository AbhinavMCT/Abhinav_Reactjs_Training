import axios from "axios";
import { Exam } from "../types/Datatypes.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const EXAM_ENDPOINT = API_URL + "/exam/";

const getHeaders = () => ({
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});

export const getAllExams = async () => {
  return axios.get(`${EXAM_ENDPOINT}get-exam`, getHeaders());
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

