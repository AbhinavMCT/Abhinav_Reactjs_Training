import api from "../interceptor.ts"
import {Assignment,AssignmentFilter} from "../types/Datatypes.ts";

const END_POINT = '/assignment/'


export const getAllAssignments = async({page,limit,search,status,startDate,endDate}:AssignmentFilter) =>{
    return await api.get(`${END_POINT}get-assignment?page=${page}&limit=${limit}&search=${search}&status=${status}&startdate=${startDate}&enddate=${endDate}`)
};

export const deleteAssignment = async(id: number)=>{
    return await api.delete(`${END_POINT}/delete-assignment/${id}`)
};

export const createAssignment = async(data: Assignment) =>{
    return await api.post(`${END_POINT}add-assignments`,data)
};

export const getAssignmentbyId = async(id: number)=>{
    return await api.get(`${END_POINT}get-assignment/${id}`)
};

export const editAssignment = async(id: number,data: Assignment)=>{
    return await api.put(`${END_POINT}edit-assignment/${id}`)
};

export const getStudentAssignments = async() =>{
    return await api.get(`${END_POINT}get-assignment-students`)
};

export const submitAssignment = async (assignmentId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);                        

  const response = await api.post(
    `/submit-assignment/add-submit/${assignmentId}`,               
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const getAllStudents = async () => {
    return await api.get(`/student/get-students`, );
};

export const getAllSubjects = async () => {
  return api.get(`/subject/get-subjects`,);
};

