import axios from "axios";
import { Department } from "../types/Datatypes.ts";
import { store } from "../store/store.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const DEPARTMENT_ENDPOINT = API_URL + "/department/";

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


export const getDepartments = async (limit: number, page: number, search: string) => {
  const response = await axios.get(`${DEPARTMENT_ENDPOINT}get-departments?limit=${limit}&page=${page}&search=${search}`, getHeaders());
  return response.data;
};

export const getDepartmentById = async (id: number) => {
  const response = await axios.get(
    `${DEPARTMENT_ENDPOINT}get-departmentsby/${id}`,
    getHeaders()
  );
  return response.data;
};

export const createDepartment = async (data: Department) => {
  const response = await axios.post(
    `${DEPARTMENT_ENDPOINT}add-department`,
    data,
    getHeaders()
  );
  return response.data;
};

export const updateDepartment = async (
  id: number,
  data: Department
) => {
  const response = await axios.put(
    `${DEPARTMENT_ENDPOINT}edit-department/${id}`,
    data,
    getHeaders()
  );
  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const response = await axios.delete(
    `${DEPARTMENT_ENDPOINT}delete-department/${id}`,
    getHeaders()
  );
  return response.data;
};