import { allocatedcourse } from "../../services/CourseApi.ts";
import { useState, useEffect } from "react";
import { StudentCourse } from "../../types/Datatypes.ts";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";

const StudentCourseView = () => {
  const [allocation, setAllocation] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllocated = async () => {
      try {
        const res = await allocatedcourse();
        setAllocation([res.data[0]]);
      } catch (error) {
        console.error("Error Fetching Data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllocated();
  }, []);

  const columns: Column<StudentCourse>[] = [
    {
      title: "Student Name",
      key: "name" as keyof StudentCourse,
    },
    {
      title: "Course Name",
      key: "course_name",
    },
  ];

  return (
    <>
    <Breadcrumbs />
      {loading ? (
        <p>Loading Allocated Student-Course records...</p>
      ) : (
        <CommonTable data={allocation} columns={columns} />
      )}
    </>
  );
};

export default StudentCourseView;