import { useState, useEffect } from "react";
import { SubjectStaffPayload,SubjectItem,StaffItem, pageprops } from "../../types/Datatypes.ts";
import { getAllStaff } from "../../services/StaffApi.ts";
import {updateSubjectStaff,getSubjectStaffById,createSubjectStaff, getAllSubjects} from "../../services/SubjectStaffApi.ts";
import "../../styles/subjectstaff/addsubjectstaff.css";
import { toast } from "react-toastify";
import SubjectStaffForm from "../../components/SubjectStaffForm.tsx";
import withCrudPage from "../hoc/withCrudPage.tsx";


const EditSubjectStaff = ({id,navigate,isEditMode,}: pageprops) => {

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
          getAllStaff(10, 1),
        ]);

        setSubjects(
          Array.isArray(subjectRes.data.subject)
            ? subjectRes.data.subject
            : JSON.parse(subjectRes.data.subject),
        );
        console.log("subjects",subjectRes.data.subject);

        setStaffList(
          Array.isArray(staffRes.data.staff)
            ? staffRes.data.staff
            : JSON.parse(staffRes.data.staff),
        );

        if(id){
          const allocData = await getSubjectStaffById(Number(id))
          setFormData(allocData.data[0]);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    if (isEditMode) {
      if (!id) {
        toast.error("Invalid allocation ID");
        return;
      }

      await updateSubjectStaff(Number(id), formData);

      toast.success("Updated Successfully");
    } else {
      await createSubjectStaff(formData);

      toast.success("Added Successfully");
    }

    navigate("/subject-staff");
  } catch (error) {
    console.error(error);

    toast.error(
      isEditMode
        ? "Failed to Update"
        : "Failed to Add"
    );
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
