import { useState } from 'react';
import axios from 'axios';
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


    // Test function to check backend connectivity
    const testBackendConnection = async () => {
        try {
            console.log('Testing backend connection...');
            // Test with a simple endpoint that doesn't require authentication
            const response = await axiosInstance.get('/auth/authenticate', {
                validateStatus: function (status) {
                    // Accept 401 as it means the endpoint exists but requires auth
                    return status === 200 || status === 401;
                }
            });
            console.log('Backend is accessible:', response.status);
            return true;
        } catch (error) {
            console.error('Backend connection failed:', error);
            return false;
        }
    };

    const uploadStudentImage = async (file, studentId) => {
        if (!studentId || !file) {
            const errorMsg = 'Student ID or file is missing';
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            const errorMsg = 'Please select a valid image file';
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            const errorMsg = 'File size must be less than 5MB';
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }

        console.log('Uploading image for student:', studentId);
        console.log('File details:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        const formData = new FormData();
        formData.append('file', file);

        // Log FormData contents for debugging
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            // Use the correct endpoint with student ID in the URL
            const endpoint = endpoints.students.uploadStudentPhoto.replace('{id}', studentId);
            console.log('Using endpoint:', endpoint);
            
            // Create a new axios instance without authentication for this specific request
            const uploadAxios = axios.create({
                baseURL: 'http://localhost:8086/api/v1',
                timeout: 30000
            });
            
            const response = await uploadAxios.put(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            console.log('Upload response:', response);
            toast.success('Profile picture updated successfully');
            return response.data;
        } catch (error) {
            console.error('Full error details:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            
            let errorMsg = 'Error updating profile picture';
            
            if (error.response?.status === 500) {
                errorMsg = 'Server error occurred. Please check if the backend service is running and the endpoint is correct.';
            } else if (error.response?.status === 404) {
                errorMsg = 'Upload endpoint not found. Please check the API configuration.';
            } else if (error.response?.status === 413) {
                errorMsg = 'File too large. Please select a smaller image.';
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            
            toast.error(errorMsg);
            throw error;
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
        testBackendConnection,
    };
};

export default useStudentService;
