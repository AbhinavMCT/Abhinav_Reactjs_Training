import { useNavigate } from "react-router-dom";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  refreshToken: any;
  accessToken: any;
  token: string;
  message: string;
}

export interface Address {
  city: string;
  district: string;
  state: string;
  pin: number;
}

export interface Login {
  username: string;
  password: string;
}

export interface ProfileData {
  id?: number;
  address_id?: number;

  name: string;
  email: string;
  contact: string;
  gender: string;
  DOB: string;

  address: Address;

  login: Login;
}

export interface RegisterPayload {

  loginData: {
    username: string;
    password: string;
    role_id: number;
  };

  addressData: Address;

  userData: {
    id?: number;
    name: string;
    email: string;
    contact: string;
    gender: string;
    DOB: string;
  };
}

export interface StudentList {
  id: number;
  name: string;
  email: string;
  contact: string;
  DOB: string;
  gender: string;
  city: string;
  district: string;
  state: string;
  pin: string;
}

export interface UpdateProfilePayload {

  userData: {
    name: string;
    email: string;
    contact: string;
    gender: string;
    DOB: string;

    address_id?: number;
  };

  addressData: {
    city: string;
    district: string;
    state: string;
    pin: number;
  };
}

export interface Exam {
  id?: number;
  name: string;
  semester: number;
  exam_date: string;
  course_id: number;
  course_name?: string;
  exam_type: string;
  total_mark: number;
}

export interface SubjectPayload {
  id?: number;
  name: string;
  type: string;
  course_id: number;
  course_name?: string;
}
export interface CourseOption {
  id: number;
  name: string;
}

export interface CoursePayload {
  id?: number;
  name: string;
  dep_id: number;
  department_name?: string;
}

export interface DepartmentOption {
  id: number;
  name: string;
}

export interface Department {
  id?: number;
  name: string;
  type: string;
  office_location: string;
  established_year: number;
}


export interface SubjectStaffPayload {
  id?: number;
  subject_id: number;
  staff_id: number;
  subject_name?: string;
  staff_name?: string;
}

export interface SubjectItem {
  id: number;
  name: string; 
}

export interface StaffItem {
  id: number;
  name: string; 
}

export interface ActivityLog{
  id?: number;
  role: string;
  action: string;
  table_name: string;
}

export interface StudentCourse{
  id: number;
  student_id: number;
  course_id: number;
  student_name?: string;
  course_name?: string;
}

export interface Studentlist{
  id: number;
  name: string;
}

export interface Courselist{
  id: number;
  name: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface JwtPayload {
  id: number;
  username: string;
  role: string;
  exp: number;
}

export interface Attendence {
    id: number,
    attendenc_count: number,
    semester: number,
    semester_name?: string,
    total_working_days: number,
    student_id: number,
    name?: string,
}

export interface Markattendence{
    attendance: {
        student_id: number;
        status: string;
    }[];
    attendance_date?: string;
    semester: number;
}

export interface AttendanceFilter {
  page: number;
  limit: number;
  search: string;
  date: string;
  status: string;
  reportType: string;
  month: string;
  year: string;
}

export interface Marks {
  id?: number;
  student_id: number;
  subject_id: number;
  exam_id: number;
  mark: number;
  grade: string;
  student_name?: string,
  subject_name?: string,
  exam_name?: string,
  obtained_mark?: number,
  maximum_mark?: number,
  percentage?: number
}

export interface Examlist {
  id: number,
  name: string
  total_mark: number;
}

export interface Assignment{
  id: number,
  assignment_name: string,
  description: string,
  start_date: string,
  end_date: string,
  subject_id: number,
  subject_name?: string,
  status?: string,
  staff_name?: string,
};

export interface AssignmentFilter {
  page: number;
  limit: number;
  search: string;
  status: string;
  startDate: string;
  endDate: string;
}

export type pageprops = {
  id?: string;
  navigate: ReturnType<typeof useNavigate>;
  isEditMode: boolean;
};