import axios from "axios";
import { store } from "../store/store.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const COURSE_ENDPOINT = API_URL + "/course/";

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



export const getAllCourses = (limit: number, page: number, search: string) => axios.get(`${COURSE_ENDPOINT}get-course?limit=${limit}&page=${page}&search=${search}`, getHeaders());
export const getCourseById = (id: number) => axios.get(`${COURSE_ENDPOINT}get-courseby/${id}`, getHeaders());
export const createCourse = (payload: { name: string; dep_id: number }) => axios.post(`${COURSE_ENDPOINT}add-course`, payload, getHeaders());
export const updateCourse = (id: number, payload: { name: string; dep_id: number }) => axios.put(`${COURSE_ENDPOINT}edit-course/${id}`, payload, getHeaders());
export const deleteCourse = (id: number) => axios.delete(`${COURSE_ENDPOINT}delete-course/${id}`, getHeaders());

export const getAllDepartments = () => axios.get(`${API_URL}/department/get-departments`, getHeaders());