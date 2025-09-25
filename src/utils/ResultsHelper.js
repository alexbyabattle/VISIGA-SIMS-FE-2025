// src/utils/resultHelpers.js

// Convert grade to points
export const getGradePoint = (grade) => {
  switch (grade) {
    case "A": return 1;
    case "B": return 2;
    case "C": return 3;
    case "D": return 4;
    case "E": return 5;
    case "F": return 6;
    default: return 0;
  }
};

// Convert total points into division label
export const getDivisionLabel = (points) => {
  if (points >= 1 && points <= 17) return `Division 1 . ${points}`;
  if (points >= 18 && points <= 20) return `Division 2 . ${points}`;
  if (points >= 21 && points <= 24) return `Division 3 . ${points}`;
  if (points >= 25 && points <= 29) return `Division 4 . ${points}`;
  return `Division 0 . ${points}`;
};

// Determine division from subjects
export const determineDivision = (subjects) => {
  const pointsArray = subjects.map((sub) => getGradePoint(sub.grade));
  if (pointsArray.length <= 7) {
    return pointsArray.reduce((sum, point) => sum + point, 0);
  } else {
    const bestSeven = pointsArray.sort((a, b) => a - b).slice(0, 7);
    return bestSeven.reduce((sum, point) => sum + point, 0);
  }
};

// Group results by student
export const groupResultsByStudent = (data) => {
  const studentMap = {};
  const allSubjects = new Set();

  // Collect all subjects & group by student
  data.forEach((item) => {
    allSubjects.add(item.subjectName);
    if (!studentMap[item.studentId]) {
      studentMap[item.studentId] = {
        id: item.studentId,
        studentName: item.studentName,
        studentNumber: item.studentNumber,
        subjects: {},
      };
    }
    studentMap[item.studentId].subjects[item.subjectName] = {
      marks: parseInt(item.marks) || 0,
      grade: item.grade || "-",
    };
  });

  // Fill missing subjects with default values (0 marks, "-")
  return Object.values(studentMap).map((student) => {
    allSubjects.forEach((subject) => {
      if (!student.subjects[subject]) {
        student.subjects[subject] = { marks: 0, grade: "-" };
      }
    });

    const subjects = Object.entries(student.subjects);
    const totalMarks = subjects.reduce(
      (sum, [_, subj]) => sum + (parseInt(subj.marks) || 0),
      0
    );
    const average =
      subjects.length > 0 ? (totalMarks / subjects.length).toFixed(2) : 0;

    return {
      ...student,
      totalMarks,
      average,
      subjects: student.subjects,
    };
  });
};
