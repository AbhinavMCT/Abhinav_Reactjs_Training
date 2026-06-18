const getSemesterName = (semester: number): string => {
  const semesterMap: Record<number, string> = {
    1: "First Semester",
    2: "Second Semester",
    3: "Third Semester",
    4: "Fourth Semester",
    5: "Fifth Semester",
    6: "Sixth Semester",
    7: "Seventh Semester",
    8: "Eighth Semester",
  };

  return semesterMap[semester] || "Unknown Semester";
};

export default getSemesterName;