import api from "../interceptor.ts";
import {Marks} from "../types/Datatypes.ts";

const MARK_END_POINT = "/mark/"

export const createMark = async(data: Marks) =>{
    return api.post(`${MARK_END_POINT}add-mark`,data)
};

export const getMarks = async(page: number,limit: number,search: string, semester?: number)=>{
    return api.get(`${MARK_END_POINT}get-marks?page=${page}&limit=${limit}&search=${search}&semester=${semester}`)
};

export const deleteMarks = async(id: number)=>{
    return api.delete(`${MARK_END_POINT}delete-mark/${id}`)
};


export const getMarkbylogin = async(semester: number)=>{
    return api.get(`${MARK_END_POINT}get-mark-login?semester=${semester}`)
};

export const getMarkbyId = async(id: number) =>{
  return api.get(`${MARK_END_POINT}get-marksby/${id}`);
};

export const updateMark = async(id: number,data: Marks) =>{
  return api.put(`${MARK_END_POINT}edit-mark/${id}`,data)
};


export const getAllSubjects = async () => {
  return api.get(`/subject/get-subject-staff-allo`,);
};


export const getAllStudents = async () => {
    return await api.get(`/student/get-students`, );
};

export const getAllExams = async () => {
  return api.get(`/exam/get-exam`, );
};

export const downloadStudentReport = async (id: number) => {
  return await api.get(`/student-report/get-student-report/${id}`,
    {
      responseType: "blob",
    }
  );
};