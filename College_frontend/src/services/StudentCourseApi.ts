import {StudentCourse} from "../types/Datatypes.ts";
import api from "../interceptor.ts";

const STUDENT_COURSE_ENDPOINT = "/student-course/";



export const getStudentCourse = async(limit: number, page: number, search: string)=>{
    return api.get(`${STUDENT_COURSE_ENDPOINT}get-StudentCourse?limit=${limit}&page=${page}&search=${search}`,
    );
};

export const getStudentcoursebyId = async(id: number)=>{
    return api.get(`${STUDENT_COURSE_ENDPOINT}get-StudentCourseById/${id}`,
    );
};

export const createStudentCourse = async(data: StudentCourse)=>{
    return api.post(`${STUDENT_COURSE_ENDPOINT}add-StudentCourse`,data,
    );
};

export const updateStudentCourse = async(id: number, data: StudentCourse)=>{
    return api.put(`${STUDENT_COURSE_ENDPOINT}edit-StudentCourse/${id}`,data,
    );
};

export const deleteStudentCourse = async(id: number)=>{
    return api.delete(`${STUDENT_COURSE_ENDPOINT}delete-StudentCourse/${id}`,
    );
};