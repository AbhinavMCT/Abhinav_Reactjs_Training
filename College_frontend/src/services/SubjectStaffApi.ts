import { SubjectStaffPayload } from "../types/Datatypes.ts";
import api from "../interceptor.ts";

const SUBJECT_STAFF_ENDPOINT = "/subject-staff/";



export const getAllSubjectStaff = async (limit: number, page: number, search: string) => {
  return api.get(`${SUBJECT_STAFF_ENDPOINT}get-subjectstaff?limit=${limit}&page=${page}&search=${search}`, );
};

export const getSubjectStaffById = async (id: number) => {
  return api.get(`${SUBJECT_STAFF_ENDPOINT}get-subjectstaff/${id}`, );
};

export const createSubjectStaff = async (data: SubjectStaffPayload) => {
  return api.post(`${SUBJECT_STAFF_ENDPOINT}add-subjectstaff`,data,);
};

export const updateSubjectStaff = async (id: number, data: SubjectStaffPayload) => {
  return api.put(`${SUBJECT_STAFF_ENDPOINT}edit-subjectstaff/${id}`,data,);
};

export const deleteSubjectStaff = async (id: number) => {
  return api.delete(`${SUBJECT_STAFF_ENDPOINT}delete-subjectstaff/${id}`,);
}

export const getAllSubjects = async () => {
  return api.get(`/subject/get-subjects`,);
};