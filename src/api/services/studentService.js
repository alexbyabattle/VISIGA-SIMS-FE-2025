import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { Response, ErrorResponse, RequestConfig } from '../api-Utils';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import toast from 'react-hot-toast';
import useToggle from '../../hooks/use-toggle';


const useStudentService = () => {
    const [students, setStudents] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, toggleLoading] = useToggle();

    const user = getUserFromCookies();
    const id = user?.data?.id;

    // Fetch all students with pagination and optional status
    const fetchStudents = async (page, size, status = null) => {
        toggleLoading();
        try {
            const url = status
                ? `${endpoints.students.All}?page=${page}&size=${size}&status=${status}`
                : `${endpoints.students.All}?page=${page}&size=${size}`;

            const response = await axiosInstance.get(url);
            const { data } = response.data;

            setTotalRecords(data.records || 0);

            setStudents(Array.isArray(data.data) ? data.data.map((student) => ({
                id: student.id,
                studentName: student.studentName,
                combination: student.combination,
                createdAt: student.createdAt,
                status: student.status,
            })) : []);
        } catch (error) {
            toast.error('Error fetching students.');
            console.error('Fetch Students Error:', error);
        } finally {
            toggleLoading();
        }
    };


    const fetchStudentsByClassId = async (classId) => {
        toggleLoading();
        try {
            // Construct URL to fetch both ACTIVE and GRADUATED students
            const baseUrl = `${endpoints.students.class}${classId}`;
            const url = `${baseUrl}?status=ACTIVE,GRADUATED`;

            const response = await axiosInstance.get(url);
            const { data } = response.data;

            const formattedStudents = Array.isArray(data)
                ? data.map((student) => ({
                    id: student.id,
                    studentName: student.studentName.trim(),
                    studentNumber: student.studentNumber,
                    combination: student.combination,
                    createdAt: student.createdAt,
                    status: student.status,
                }))
                : [];

            setStudents(formattedStudents);
            setTotalRecords(formattedStudents.length);
        } catch (error) {
            toast.error('Error fetching students by class.');
            console.error('Fetch Students By Class Error:', error);
        } finally {
            toggleLoading();
        }
    };


    const generateStudentsNumberByClassId = async (classId) => {

        try {

            const baseUrl = `${endpoints.students.generateIndexNo}${classId}`;

            const response = await axiosInstance.post(baseUrl);
            const { data } = response.data;
            toast.success('Index NUmber  are  generated  successfully  to each student');

        } catch (error) {
            toast.error('Error in generating index number ');
            console.error('Error in generating index number', error);
        } finally {

        }
    };


    // Create new student
    const createStudent = async (studentDto, onSuccess) => {
        // console.log("service data ", studentDto);
        try {
            const response = await axiosInstance.post(endpoints.students.create, studentDto);
            toast.success(response.data.message || 'Students created successfully');
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating students');
            console.error('Error creating student:', error);
        }
    };

    
    const loadStudentDetails = async (studentId) => {
        
        try {
            toggleLoading();
            const response = await axiosInstance.get(`${endpoints.students.get}${studentId}`);
            //toast.success(response.data.message || 'Student details loaded successfully');
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching student details');
            console.error('Error fetching student details:', error);
            throw error;
        } finally {
            toggleLoading();
        }
    };

    const loadStudentParentsDetails = async (studentId) => {
        
        try {
            toggleLoading();
            const response = await axiosInstance.get(`${endpoints.students.parents}${studentId}`);
            //toast.success('Student parents details loaded successfully');
            return response.data.data;
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching student details');
            console.error('Error fetching student details:', error);
            throw error;
        } finally {
            toggleLoading();
        }
    };


    // Load student, class, and subject info
    const loadStudentsFromClass = async (classId) => {
        try {
            toggleLoading();
            const response = await axiosInstance.get(`${endpoints.students.class}/${classId}`);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching student details');
            console.error('Error fetching student details:', error);
            throw error;
        } finally {
            toggleLoading();
        }
    };

    // Update student
    const updateStudentDetails = async (studentId, updateStudentDetailsDto) => {
        try {
            const response = await axiosInstance.put(`${endpoints.students.update}${studentId}`, updateStudentDetailsDto);
            toast.success(response.data.message || 'Student details updated successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating student details');
            console.error('Error updating student details:', error);
            throw error;
        }
    };



    const deleteStudent = async (studentId, currentStatus, onSuccess) => {
        const newStatus = currentStatus === 'DISABLED' ? 'ACTIVE' : 'DISABLED';
        const apiUrl = `${endpoints.students.delete}?id=${studentId}&status=${newStatus}`;

        try {
            const response = await axiosInstance.post(apiUrl);
            toast.success(response.data.message || 'Student status updated successfully');
            onSuccess();
        } catch (error) {
            toast.error('Error in updating student status.');
            console.error('Error updating student status:', error);
        }
    };


    const fetchActiveStudents = async () => {
        toggleLoading();
        try {
            const response = await axiosInstance.get(`${endpoints.students.All}?page=0&size=100&status=ACTIVE`);
            const { data } = response.data;
            const transformed = (data.data || []).map((student) => ({
                id: student.id,
                studentName: student.studentName,
                combination: student.combination,
                createdAt: student.createdAt,
                status: student.status,
            }));
            return transformed;
        } catch (error) {
            toast.error('Error fetching students.');
            console.error('Fetch Students Error:', error);
            return [];
        } finally {
            toggleLoading();
        }
    };


    const uploadStudentImage = async (file, studentId) => {
        if (!studentId || !file) {
            toast.error('Student ID or file is missing');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const formData = new FormData();
        formData.append('id', studentId);
        formData.append('file', file);

        try {
            await axiosInstance.put(`${endpoints.students.uploadStudentPhoto}`, formData, config);
            toast.success('Profile picture updated successfully');
        } catch (error) {
            toast.error('Error updating profile picture');
            console.error('Error updating profile picture:', error);
        }
    };


    return {
        students,
        totalRecords,
        isLoading,
        fetchStudents,
        fetchStudentsByClassId,
        createStudent,
        loadStudentDetails,
        loadStudentsFromClass,
        fetchActiveStudents,
        updateStudentDetails,
        deleteStudent,
        generateStudentsNumberByClassId,
        uploadStudentImage,
        loadStudentParentsDetails,
    };
};

export default useStudentService;
