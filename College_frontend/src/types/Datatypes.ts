export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
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