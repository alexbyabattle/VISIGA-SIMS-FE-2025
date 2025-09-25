import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./Protected-Route";
import Login from "../Pages/Authentication/login";
import Home from "../scenes/Home/Home";
import ResetPassword from "../Pages/Authentication/Reset-password";
import Dashboard from "../Pages/dashboard";
import Team from "../Pages/team";
import UserDetails from "../Pages/User/user-details";
import UserTable from "../Pages/User/users";
import NotFoundPage from "../Pages/Authentication/NotFoundPage";
import Bar from "../Pages/bar";
import Pie from "../Pages/pie";
import Line from "../Pages/line";
import FAQ from "../Pages/faq";
import Form from "../scenes/form";
import Calendar from "../Pages/calendar/calendar";
import Geography from "../Pages/geography";
import Sessions from "../Pages/session/session";
import ProfileDetails from "../Pages/User/profileDetails";
import Teachers from "../Pages/Teachers/Teachers";
import Teacher_Data from "../Pages/Teachers/Get_Teachers";
import ClassExams from "../Pages/ClassExaminationType/ClassExams";
import Subject_Results from "../Pages/Results/Subject_Results";
import Classes from "../Pages/Class/Classes";
import Class_Data from "../Pages/Class/Class_Details";
import ClassStudents from "../Pages/Students/Students";
import Parents from "../Pages/Parents/Parents";
import Parents_Data from "../Pages/Parents/Get_Parents";
import Examination_Data from "../Pages/Examinations/Examination_Details";
import Examinations from "../Pages/Examinations/Examinations";
import Subjects from "../Pages/Subjects/Subjects";
import Subject_Data from "../Pages/Subjects/Get_Subject";
import ClassResults from "../Pages/Results/Class_Results";
import Student_Examination from "../Pages/Examinations/StudentExamination";
import StudentResults from "../Pages/Results/Student_Results";
import ParentViewStudentResults from "../Pages/Parents/ParentViewStudentResults";
import ParentViewStudentsDetails from "../Pages/Parents/ParentViewStudentDetails";
import StudentDetails from "../Pages/Students/StudentDetails";
import SchoolTimetable from "../Pages/TimeTables/SchoolTimetable";
import TeacherDutyRoster from "../Pages/TimeTables/TeachersDuty";
import ClassTimetable from "../Pages/TimeTables/ClassTimeTable";
import AlevelClassResults from "../Pages/Results/Alevel_Class_Results";
import AlevelStudentResults from "../Pages/Results/Alevel_Student_Results";
import ParentsOfStudent from "../Pages/Students/ParentsOfStudent";
import Class_Term_Data from "../Pages/Term/Class_terms";
import Term from "../Pages/Term/Term";
import ClassTermReport from "../Pages/Results/ClassTermReport";
import Student_Term_Data from "../Pages/Term/Student_Terms";
import StudentReportResults from "../Pages/Results/Student_Report_Results";
import AlevelStudentResultsMark100 from "../Pages/Results/Alevel_Student_Results_Marks100";
import StudentResultsMarks100 from "../Pages/Results/Student_Results_Marks100";
import AlevelClassResultsMarks100 from "../Pages/Results/Alevel_Class_Results_Marks100";
import ClassResultsMarks100 from "../Pages/Results/Class_Results_Marks100";
import StudentEvaluationReport from "../Pages/StudentEvaluation/StudentEvaluationReport";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/resetPassword" element={<ResetPassword />} />

      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={['ADMIN', 'TEACHER', 'PARENT']} />} />
      <Route path="/team" element={<Team />} />

      <Route path="/parents" element={<ProtectedRoute element={<Parents />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/parent_details/:id" element={<ProtectedRoute element={<Parents_Data />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} />} />
      <Route path="/parent_view_results" element={<ProtectedRoute element={<ParentViewStudentResults />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} />} />
      <Route path="/parent_view_student_details" element={<ProtectedRoute element={<ParentViewStudentsDetails />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} />} />

      <Route path="/subjects" element={<ProtectedRoute element={<Subjects />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/subject_details/:id" element={<ProtectedRoute element={<Subject_Data />} allowedRoles={['ADMIN', 'MANAGER']} />} />

      <Route path="/schoolTimetable" element={<ProtectedRoute element={<SchoolTimetable />} allowedRoles={['ADMIN', 'TEACHER']} />} />
      <Route path="/teachersDuty" element={<ProtectedRoute element={<TeacherDutyRoster />} allowedRoles={['ADMIN', 'TEACHER']} />} />
      <Route path="/classTimetable" element={<ProtectedRoute element={<ClassTimetable />} allowedRoles={['ADMIN', 'TEACHER']} />} />

      <Route path="/examinations" element={<ProtectedRoute element={<Examinations />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/examination_details/:id" element={<ProtectedRoute element={<Examination_Data />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/exams_details/:classId/:studentId" element={ <ProtectedRoute element={<Student_Examination />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} /> } />


      <Route path="/teachers" element={<ProtectedRoute element={<Teachers />} allowedRoles={['ADMIN', 'MANAGER', 'TEACHER']} />} />
      <Route path="/teacher_details/:id" element={<ProtectedRoute element={<Teacher_Data />} allowedRoles={['ADMIN', 'MANAGER', 'TEACHER']} />} />

      <Route path="/classes" element={<ProtectedRoute element={<Classes />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/class_students/:id" element={<ProtectedRoute element={<ClassStudents />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/class_details/:id" element={<ProtectedRoute element={<Class_Data />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/class_exams/:subjectId/:teacherId/:clazzId"  element={<ProtectedRoute element={<ClassExams />} allowedRoles={['ADMIN', 'MANAGER', 'TEACHER']} />} />

      <Route path="/subject_results/:teacherId/:subjectId/:clazzId/:examinationTypeId" element={ <ProtectedRoute element={<Subject_Results />} allowedRoles={['ADMIN', 'MANAGER' , 'TEACHER']} /> } />

      <Route path="/class_results/:id" element={<ProtectedRoute element={<ClassResults />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/class_results_marks/:id" element={<ProtectedRoute element={<ClassResultsMarks100 />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/A-level_results/:id" element={<ProtectedRoute element={<AlevelClassResults />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/A-level_results_marks/:id" element={<ProtectedRoute element={<AlevelClassResultsMarks100 />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      

      <Route  path="/student_results/:studentId/:classId/:examId" element={ <ProtectedRoute element={<StudentResults />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} />  } />
      <Route  path="/student_results_marks/:studentId/:classId/:examId" element={ <ProtectedRoute element={<StudentResultsMarks100 />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} />  } />
      <Route  path="/alevel_student_results/:studentId/:classId/:examId" element={ <ProtectedRoute element={<AlevelStudentResults />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} />  } />
      <Route  path="/alevel_student_results_marks/:studentId/:classId/:examId" element={ <ProtectedRoute element={<AlevelStudentResultsMark100 />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} />  } />
      <Route path="/student_details/:studentId" element={<ProtectedRoute element={<StudentDetails />} allowedRoles={['ADMIN', 'MANAGER' ,'PARENT']} />} />
      <Route path="/student_parents/:studentId" element={<ProtectedRoute element={<ParentsOfStudent />} allowedRoles={['ADMIN', 'MANAGER']} />} />

      <Route path="/terms" element={<ProtectedRoute element={<Term />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/class-terms/:id" element={<ProtectedRoute element={<Class_Term_Data />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/term-class-results/:id" element={<ProtectedRoute element={<ClassTermReport />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/term_results_page/:classId/:studentId" element={ <ProtectedRoute element={<Student_Term_Data />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} /> } />
      <Route  path="/term_student_results/:studentId/:classId/:termId" element={ <ProtectedRoute element={<StudentReportResults />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} />  } />
       
      <Route path="/student_evaluation_report/:termId/:studentId" element={ <ProtectedRoute element={<StudentEvaluationReport />} allowedRoles={['ADMIN', 'MANAGER', 'PARENT']} /> } />

      <Route path="/sessions/:userId" element={<ProtectedRoute element={<Sessions />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      

      <Route path="/users" element={<ProtectedRoute element={<UserTable />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/userDetails/:userId" element={<ProtectedRoute element={<UserDetails />} allowedRoles={['ADMIN', 'MANAGER']} />} />
      <Route path="/profileDetails/:userId" element={<ProtectedRoute element={<ProfileDetails />} allowedRoles={['ADMIN', 'USER', 'MANAGER', 'TEACHER' , 'PARENT']} />} />

      <Route path="/bar" element={<Bar />} />
      <Route path="/pie" element={<Pie />} />
      <Route path="/line" element={<Line />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/form" element={<Form />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/geography" element={<Geography />} />

      <Route path="/notFound" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/notFound" />} />
    </Routes>
  );
};

export default AppRoutes;
