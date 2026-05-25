import axios from "axios";

const API_URL = import.meta.env.VITE_BackEndURL;
const COURSE_ENDPOINT = API_URL + "/course/";

const getHeaders = () => ({
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});



export const getAllCourses = () => axios.get(`${COURSE_ENDPOINT}get-course`, getHeaders());
export const getCourseById = (id: number) => axios.get(`${COURSE_ENDPOINT}get-courseby/${id}`, getHeaders());
export const createCourse = (payload: { name: string; dep_id: number }) => axios.post(`${COURSE_ENDPOINT}add-course`, payload, getHeaders());
export const updateCourse = (id: number, payload: { name: string; dep_id: number }) => axios.put(`${COURSE_ENDPOINT}edit-course/${id}`, payload, getHeaders());
export const deleteCourse = (id: number) => axios.delete(`${COURSE_ENDPOINT}delete-course/${id}`, getHeaders());

export const getAllDepartments = () => axios.get(`${API_URL}/department/get-departments`, getHeaders());