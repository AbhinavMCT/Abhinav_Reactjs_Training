import api from "../interceptor.ts";
import axios from "axios";

const COURSE_ENDPOINT = "/course/";

export const getAllcoursesview = () => axios.get(`${COURSE_ENDPOINT}view-course`,);
export const getAllCourses = (limit: number, page: number, search: string) => api.get(`${COURSE_ENDPOINT}get-course?limit=${limit}&page=${page}&search=${search}`,);
export const getCourseById = (id: number) => api.get(`${COURSE_ENDPOINT}get-courseby/${id}`,);
export const createCourse = (payload: { name: string; dep_id: number }) => api.post(`${COURSE_ENDPOINT}add-course`, payload,);
export const updateCourse = (id: number, payload: { name: string; dep_id: number }) => api.put(`${COURSE_ENDPOINT}edit-course/${id}`, payload,);
export const deleteCourse = (id: number) => api.delete(`${COURSE_ENDPOINT}delete-course/${id}`, );
export const allocatedcourse = () => api.get(`${COURSE_ENDPOINT}get-allocatedcourse`);
export const getAllDepartments = () => api.get(`/department/get-departments`,);