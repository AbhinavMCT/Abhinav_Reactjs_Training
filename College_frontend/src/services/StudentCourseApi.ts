import axios from "axios";
import {StudentCourse} from "../types/Datatypes.ts";
import { store } from "../store/store.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const STUDENT_COURSE_ENDPOINT = API_URL + "/student-course/";

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

export const getStudentCourse = async(limit: number, page: number, search: string)=>{
    return axios.get(`${STUDENT_COURSE_ENDPOINT}get-StudentCourse?limit=${limit}&page=${page}&search=${search}`,
        getHeaders(),
    );
};

export const getStudentcoursebyId = async(id: number)=>{
    return axios.get(`${STUDENT_COURSE_ENDPOINT}get-StudentCourseById/${id}`,getHeaders(),
    );
};

export const createStudentCourse = async(data: StudentCourse)=>{
    return axios.post(`${STUDENT_COURSE_ENDPOINT}add-StudentCourse`,data,
        getHeaders(),
    );
};

export const updateStudentCourse = async(id: number, data: StudentCourse)=>{
    return axios.put(`${STUDENT_COURSE_ENDPOINT}edit-StudentCourse/${id}`,data,
        getHeaders(),
    );
};

export const deleteStudentCourse = async(id: number)=>{
    return axios.delete(`${STUDENT_COURSE_ENDPOINT}delete-StudentCourse/${id}`,
        getHeaders(),
    );
};