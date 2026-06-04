import axios from "axios";
import {StudentCourse} from "../types/Datatypes.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const STUDENT_COURSE_ENDPOINT = API_URL + "/student-course/";

const getAuthHeaders = () => ({
  "content-type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

export const getStudentCourse = async()=>{
    return axios.get(`${STUDENT_COURSE_ENDPOINT}get-StudentCourse`,{
        headers: getAuthHeaders(),
    });
};

export const getStudentcoursebyId = async(id: number)=>{
    return axios.get(`${STUDENT_COURSE_ENDPOINT}get-StudentCourseById/${id}`,{
        headers: getAuthHeaders(),
    });
};

export const createStudentCourse = async(data: StudentCourse)=>{
    return axios.post(`${STUDENT_COURSE_ENDPOINT}add-StudentCourse`,data,{
        headers: getAuthHeaders(),
    });
};

export const updateStudentCourse = async(id: number, data: StudentCourse)=>{
    return axios.put(`${STUDENT_COURSE_ENDPOINT}edit-StudentCourse/${id}`,data,{
        headers: getAuthHeaders(),
    });
};

export const deleteStudentCourse = async(id: number)=>{
    return axios.delete(`${STUDENT_COURSE_ENDPOINT}delete-StudentCourse/${id}`,{
        headers: getAuthHeaders(),
    });
};