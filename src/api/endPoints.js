
export const endpoints = {

  authentication: {
    signIn: '/auth/authenticate',
    signOut: '/auth/sign-out',
    getUser: '/auth/user',
    refreshToken: '/auth/refresh',
  },

  users: {
    resetPassword: '/users/reset-password',
    signUp: '/users/register',
    newPassword: '/users/new-password',
    changePassword: '/users/password',
    update: '/users/update/',
    getUser: '/users/',
    getUsers: '/users',
    status: '/users/status',
    uploadFile: '/users/{id}/photo'
  },


  teachers: {
    create: '/teachers',
    getTeachers: '/teachers',
    getTeacherSubjects: '/teachers/details/',
    getTeacher: '/teachers/',
    update: '/teachers',
    status: '/teachers/status',
    uploadFile: '/teachers/files/photo',
  },


  terms: {
    create: '/terms',
    getTerms: '/terms',
    getTerm: '/terms/',
    update: '/terms',
    status: '/terms/status',
    rotateStatus: '/terms/rotate-status',
  },


  class: {
    create: '/classes',
    getClasses: '/classes',
    getClass:'/classes/',
    getClassDetails: '/classes/subjects/',
    update: '/classes',
    status: '/classes/status',
    assign: '/classes/assign/',
    unassign: '/classes/unassign/',   
    GraduateStatus: '/classes/graduate-status/'
  },

  subject: {
    create: '/subjects',
    All: '/subjects',
    get:'/subjects/',
    update: '/subjects',
    delete: '/subjects/status',
    details: '/subjects/details/',
    assign: '/subjects/assign',
    unassign: '/subjects/unassign',   
  },

  students: {
    create: '/students',
    All: '/students',
    get:'/students/',
    update: '/students/update/',
    delete: '/students/status',
    class: '/students/class/',
    parents: '/students/parents/',
    class_students: '/students/student_in_class/',
    generateIndexNo: '/students/generate-numbers/',
    uploadStudentPhoto: '/students/{id}/photo'
  },

  parents: {
    create: '/parents',
    All: '/parents',
    get:'/users/',
    update: '/parents',
    delete: '/parents/status',
    status: '/parents/status',
    students: '/parents/students/',
    assign : '/parents/assign/',
    unassign : '/parents/unassign/',
    getAssignments : '/parents/assignments/',
  },

  
  examinationType: {
    create: '/examination-types',
    getExams: '/examination-types',
    getExaminationType: '/examination-types/',
    update: '/examination-types',
    delete: '/examination-types/status',
    getClassExams: '/examination-types/exams',
    getAll: '/examination-types/all',
    publish : '/examination-types/publish'
  },

  results: {
    initializeResults: '/results/generate-results',
    getResults: '/results',
    getResult: '/results/',
    update: '/results',
    status: '/results/status',
    getExamByClassId: '/results/examination-types',
    getTermsByClassId: '/results/list_class_terms',
    StudentResults : '/results/class-exam-student',
    classResults : '/results/class-and-exam',
    fetch_subject_results : '/results/clazz',
    generateSubjectResult: '/results/generate-results',
    sendSms : '/results/sms/notify/',
    getResultsByTermAndClass: '/results/term-class-results',
    getResultsByTermClassAndStudent: '/results/student-term-class-results',
    deleteClassSubjectResults: '/results/delete-class-subject-results',
  },

  sessions: {
    getUserSessions: '/sessions/user',
  },

  studentEvaluations: {
    create: '/student-evaluations',
    createByTermStudent: '/student-evaluations/by-term-student',
    All: '/student-evaluations',
    get: '/student-evaluations/',
    getByTermStudent: '/student-evaluations/by-term-student',
    getByStudent: '/student-evaluations/by-student',
    getByTerm: '/student-evaluations/by-term',
    update: '/student-evaluations',
    updateByTermStudent: '/student-evaluations/by-term-student',
    updatePartialByTermStudent: '/student-evaluations/by-term-student',
    exists: '/student-evaluations/exists',
    status: '/student-evaluations/status',
  },
};
