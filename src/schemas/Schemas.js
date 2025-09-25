import * as yup from 'yup';
import dayjs from 'dayjs';

export const ChangePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  password: yup.string().min(6, 'New password must be at least 6 characters').required('New password is required'),
});

export const SelectSubjectSchema = yup.object().shape({
  selectedSubjects: yup
    .array()
    .of(yup.object().required())
    .min(1, 'You must select at least one subject')
    .required('Subjects selection is required'),

  dateTime: yup
    .date()
    .required('Date and time is required'),
}); 


export const SubjectSchema = yup.object().shape({
  subjectName: yup.string()
      .min(2, 'Subject name must be at least 2 characters')
      .required('Subject name is required'),
  createdAt: yup.mixed()
      .test('is-dayjs', 'Invalid date', value => dayjs.isDayjs(value))
      .required('Creation date is required'),
});




export const SelectedTeacherSchema = yup.object().shape({
  
  selectedTeachers: yup
    .array()
    .min(1, 'At least one teacher must be selected')
    .required('Teacher selection is required'),

  // Validate dateTime as Dayjs object
  dateTime: yup
    .mixed()
    .test(
      'is-dayjs',
      'Invalid date format',
      value => dayjs.isDayjs(value) && value.isValid()
    )
    .required('Date and time is required'),
});







export const TeacherSchema = yup.object().shape({
  name: yup
    .string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters'),
    
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
    
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Phone number must be numeric')
    .min(8, 'Phone number must be at least 8 digits'),
    
  createdAt: yup
    .date()
    .required('Creation date is required'),
});


export const StudentSchema = yup.object().shape({
  studentName: yup
    .string()
    .required("Student name is required")
    .min(3, "Student name must be at least 3 characters"),

  parishName: yup
    .string()
    .required("Parish name is required"),

  archdiocese: yup
    .string()
    .required("Archdiocese is required"),

  communityZone: yup
    .string()
    .required("Community zone is required"),

  communityName: yup
    .string()
    .required("Community name is required"),
  
});


export const CreateStudentSchema = yup.object().shape({
  studentName: yup
    .string()
    .required("Student name is required")
    .min(3, "Student name must be at least 3 characters"),

  combination: yup
    .string()
    .required(" is required"),
    
  createdAt: yup
  .date()
  .required('Creation date is required'),

  
});



export const ParentSchema = yup.object().shape({
  name: yup
    .string()
    .required('Parent name is required')
    .min(3, 'Name must be at least 3 characters'),

  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),

  phoneNumber: yup
    .string()
    .matches(/^\d{10,15}$/, 'Phone number must be between 10 and 15 digits')
    .required('Phone number is required'),

  createdAt: yup
    .date()
    .required('Creation date is required'),
});


export const TermSchema = yup.object({
  termName: yup.string()
    .required('Term name is required')
    .min(2, 'Term name must be at least 2 characters')
    .max(50, 'Term name must not exceed 50 characters'),
    
  createdAt: yup.date()
    .required('Created At date is required')
    .typeError('Invalid date format'),
});


export const ExaminationSchema = yup.object().shape({
    examinationName: yup.string()
        .required('Examination name is required')
        .min(3, 'Examination name must be at least 3 characters')
        .max(100, 'Examination name must be at most 100 characters'),
    examMarks: yup.string()
        .required('Examination Marks is required'),
        
    createdAt: yup.date()
        .required('Creation date is required')
        .typeError('Invalid date'),
});  





