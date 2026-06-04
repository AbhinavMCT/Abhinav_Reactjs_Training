import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SubjectStaffPayload,SubjectItem,StaffItem } from "../../types/Datatypes.ts";

import { getAllSubjects } from "../../services/SubjectApi.ts";
import { getAllStaff } from "../../services/StaffApi.ts";

import {
  updateSubjectStaff,
  getSubjectStaffById,
  createSubjectStaff,
} from "../../services/SubjectStaffApi.ts";

import "../../styles/subjectstaff/addsubjectstaff.css";
import { toast } from "react-toastify";
import SubjectStaffForm from "../../components/SubjectStaffForm.tsx";
import withCrudPage from "../hoc/withCrudPage.tsx";


type DepartmentPageProps = {
  id?: string;
  navigate: ReturnType<typeof useNavigate>;
  isEditMode: boolean;
};

const EditSubjectStaff = ({
  id,
  navigate,
  isEditMode,
}: DepartmentPageProps) => {


  const [formData, setFormData] = useState<SubjectStaffPayload>({
    subject_id: 0,
    staff_id: 0,
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);


  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectRes, staffRes] = await Promise.all([
          getAllSubjects(),
          getAllStaff(),
        ]);

        setSubjects(
          Array.isArray(subjectRes.data)
            ? subjectRes.data
            : JSON.parse(subjectRes.data),
        );
        console.log("subjects",subjectRes.data);

        setStaffList(
          Array.isArray(staffRes.data)
            ? staffRes.data
            : JSON.parse(staffRes.data),
        );

        if(id){
          const allocData = await getSubjectStaffById(Number(id))
          setFormData(allocData.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "staff_id" || name === "subject_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) return;

    try {
      if(!isEditMode) return;
      if(isEditMode){
        await updateSubjectStaff(Number(id), formData);

      toast.success("Updated Successfully");

      navigate("/subject-staff");
      }else{
        await createSubjectStaff(formData);
              toast.success("Added Successfully");
              navigate("/subject-staff");
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to Update");
    }
  };

  return (
    <SubjectStaffForm 
    formData={formData}
    subjects={subjects}
    staffList={staffList}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
    buttonText={isEditMode? "edit":"add"}
    title={isEditMode? "Edit Allocation":"Add Allocation"}
    />
  );
};

export default withCrudPage(EditSubjectStaff);
