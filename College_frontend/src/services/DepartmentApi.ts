import { Department } from "../types/Datatypes.ts";
import api from "../interceptor.ts";

const DEPARTMENT_ENDPOINT = "/department/";




export const getDepartments = async (limit: number, page: number, search: string) => {
  const response = await api.get(`${DEPARTMENT_ENDPOINT}get-departments?limit=${limit}&page=${page}&search=${search}`,);
  return response.data;
};

export const getDepartmentById = async (id: number) => {
  const response = await api.get(
    `${DEPARTMENT_ENDPOINT}get-departmentsby/${id}`,
    
  );
  return response.data;
};

export const createDepartment = async (data: Department) => {
  const response = await api.post(
    `${DEPARTMENT_ENDPOINT}add-department`,
    data,
  );
  return response.data;
};

export const updateDepartment = async (
  id: number,
  data: Department
) => {
  const response = await api.put(
    `${DEPARTMENT_ENDPOINT}edit-department/${id}`,
    data,
  );
  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const response = await api.delete(
    `${DEPARTMENT_ENDPOINT}delete-department/${id}`,
  );
  return response.data;
};