import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Assignment, SubjectItem } from "../../types/Datatypes.ts";

import {
  getAllSubjects,
  createAssignment,
  getAssignmentbyId,
  editAssignment,
} from "../../services/AssignmentApi.ts";

import AssignmentForm from "../../components/AssignmentForm.tsx";
import withCrudPage from "../hoc/withCrudPage.tsx";

type AssignmentProps = {
  id?: string;
  navigate: ReturnType<typeof useNavigate>;
  isEditMode: boolean;
};

const AssignmentPage = ({ id, navigate, isEditMode }: AssignmentProps) => {
  const [assignment, setAssignment] = useState<Assignment>({
    id: 0,
    assignment_name: "",
    description: "",
    start_date: "",
    end_date: "",
    subject_id: 0,
  });

  const [errors, setErrors] = useState({
    assignment_name: "",
    description: "",
    subject_id: "",
    start_date: "",
    end_date: "",
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  const validateForm = () => {
    const newErrors = {
      assignment_name: "",
      description: "",
      subject_id: "",
      start_date: "",
      end_date: "",
    };

    let isValid = true;

    if (!assignment.assignment_name.trim()) {
      newErrors.assignment_name = "Assignment name is required";
      isValid = false;
    } else if (assignment.assignment_name.trim().length < 3) {
      newErrors.assignment_name = "Minimum 3 characters required";
      isValid = false;
    }

    if (!assignment.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (assignment.description.trim().length < 10) {
      newErrors.description = "Minimum 10 characters required";
      isValid = false;
    }

    if (!assignment.subject_id) {
      newErrors.subject_id = "Please select a subject";
      isValid = false;
    }

    if (!assignment.start_date) {
      newErrors.start_date = "Start date is required";
      isValid = false;
    }

    if (!assignment.end_date) {
      newErrors.end_date = "End date is required";
      isValid = false;
    }

    if (
      assignment.start_date &&
      assignment.end_date &&
      new Date(assignment.end_date) < new Date(assignment.start_date)
    ) {
      newErrors.end_date = "End date must be after start date";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const subjectData = await getAllSubjects();

        setSubjects(subjectData.data.subject);
      } catch (error) {
        console.error(error);

        toast.error("Failed to load data");
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadAssignment = async () => {
      if (!isEditMode) return;

      try {
        const res = await getAssignmentbyId(Number(id));
        console.log(res.data[0]);
        setAssignment(res.data[0]);
      } catch (error) {
        console.error(error);

        toast.error("Failed to load assignment");
      }
    };

    loadAssignment();
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setAssignment((prev: any) => ({
      ...prev,
      [name]: name === "subject_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
        
      if (isEditMode) {
        if (!id) {
        toast.error("Invalid allocation ID");
        return;
      }

        await editAssignment(Number(id), assignment);

        toast.success("Updated Successfully");
      } else {
        await createAssignment(assignment);

        toast.success("Created Successfully");
      }

      navigate("/assignment-view");
    } catch (error) {
      console.error(error);

      toast.error("Operation Failed");
    }
  };

  return (
    <AssignmentForm
      assignment={assignment}
      subjects={subjects}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
      buttonText={isEditMode ? "Update Assignment" : "Create Assignment"}
      title={isEditMode ? "Edit Assignment" : "Create Assignment"}
    />
  );
};

export default withCrudPage(AssignmentPage);
