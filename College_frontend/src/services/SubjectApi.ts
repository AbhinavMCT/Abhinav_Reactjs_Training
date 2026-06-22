import { SubjectPayload } from "../types/Datatypes.ts";
import api from "../interceptor.ts";

const SUBJECT_ENDPOINT = "/subject/";



export const getAllSubjects = async (limit: number, page: number, search: string) => {
  return api.get(`${SUBJECT_ENDPOINT}get-subjects?limit=${limit}&page=${page}&search=${search}`,);
};



export const getSubjectById = async (id: number) => {
  return api.get(`${SUBJECT_ENDPOINT}get-subjectby/${id}`, );
};

export const createSubject = async (data: SubjectPayload) => {
  return api.post(
    `${SUBJECT_ENDPOINT}add-subject`,
    data,
  );
};

export const updateSubject = async (id: number,data: SubjectPayload) => {
  return api.put(
    `${SUBJECT_ENDPOINT}edit-subject/${id}`,
    data,
  );
};

export const deleteSubject = async (id: number) => {
  return api.delete(
    `${SUBJECT_ENDPOINT}delete-subject/${id}`,
  );
};

export const getAllCourses = () => api.get(`/course/get-course`,);
