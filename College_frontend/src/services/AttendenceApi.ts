import api from "../interceptor.ts";
import { Attendence, Markattendence, AttendanceFilter } from "../types/Datatypes.ts";

const ATTENDENCE_ENDPOIN = "/attendence/";

export const getallattenndence = async ({page, limit, search, date, status, reportType,  month, year, course_id}: AttendanceFilter) => {
    console.log("Sending courseId:", course_id);
    return api.get(`${ATTENDENCE_ENDPOIN}get-all-attendence?limit=${limit}&page=${page}&search=${search}&date=${date}&status=${status}&reportType=${reportType}&month=${month}&year=${year}&course_id=${course_id}`)
};

export const getattendencebystudent = async (semester: number,date: string, status: string, reportType: string,month: string,year: string,courseId: number) => {
    return api.get(`${ATTENDENCE_ENDPOIN}get-attendence-student?semester=${semester}&date=${date}&status=${status}&reportType=${reportType}&month=${month}&year=${year}&courseId=${courseId}`)
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

export const updatemarkedAttendence = async(id: number, status: string,attendance_date: string,semester: number,course_id: number) =>{
    return api.put(`${ATTENDENCE_ENDPOIN}update-attendance/${id}?status=${status}&attendance_date=${attendance_date}&semester=${semester}&course_id=${course_id}`)
};


export const getStudentsByCourse = async (id: number) => {
    return await api.get(`/course/get-allocatedcourses/${id}`, );
};

export const getAllCourse = async () => {
  return api.get(`/course/get-course-staff-allo`,);
};

export const allocatedcourse = () => api.get(`/course/get-allocatedcourse`);

