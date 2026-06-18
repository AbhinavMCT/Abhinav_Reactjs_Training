import api from "../interceptor.ts";
import { Attendence, Markattendence, AttendanceFilter } from "../types/Datatypes.ts";

const ATTENDENCE_ENDPOIN = "/attendence/";

export const getallattenndence = async ({page, limit, search, date, status, reportType,  month, year}: AttendanceFilter) => {
    return api.get(`${ATTENDENCE_ENDPOIN}get-all-attendence?limit=${limit}&page=${page}&search=${search}&date=${date}&status=${status}&reportType=${reportType}&month=${month}&year=${year}`)
};

export const getattendencebystudent = async () => {
    return api.get(`${ATTENDENCE_ENDPOIN}get-attendence-student`)
};

export const getattendencebyID = async (id: number) => {
    return api.get(`${ATTENDENCE_ENDPOIN}get-attendencebyid/${id}`)
};

export const createAttendence = async (formData: Attendence) => {
    return api.post(`${ATTENDENCE_ENDPOIN}add-attendence`, formData)
};

export const updateAttendence = async (formData: Attendence, id: number) => {
    return api.put(`${ATTENDENCE_ENDPOIN}edit-attendence/${id}`, formData)
};

export const deleteAttendence = async (id: number) => {
    return api.delete(`${ATTENDENCE_ENDPOIN}delete-attendence/${id}`,)
};

export const markAttendance = async (data: Markattendence) => {
    return api.put(`${ATTENDENCE_ENDPOIN}mark-attendance`,data,);
};