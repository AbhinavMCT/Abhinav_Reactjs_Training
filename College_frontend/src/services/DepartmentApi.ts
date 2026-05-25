import axios from "axios";
import { Department } from "../types/Datatypes.ts";

const API_URL = import.meta.env.VITE_BackEndURL;
const DEPARTMENT_ENDPOINT = API_URL + "/department/";

const getHeaders = () => ({
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});


export const getDepartments = async () => {
  const response = await axios.get(`${DEPARTMENT_ENDPOINT}get-departments`, getHeaders());
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