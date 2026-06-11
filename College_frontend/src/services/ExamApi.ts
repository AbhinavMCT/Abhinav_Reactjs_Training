import { Exam } from "../types/Datatypes.ts";
import api from "../interceptor.ts";

const EXAM_ENDPOINT =   "/exam/";



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

