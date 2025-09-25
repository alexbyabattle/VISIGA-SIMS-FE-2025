import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { Response, ErrorResponse, RequestConfig } from '../api-Utils';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { toast } from 'react-hot-toast';
import useToggle from '../../hooks/use-toggle';


const useTeacherService = () => {
    const [teachers, setTeachers] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, toggleLoading] = useToggle();

    const user = getUserFromCookies();
    const id = user?.data?.id;

    const fetchTeachers = async (_page, _size, status = null) => {
        const page = _page ?? 0;
        const size = _size ?? 100;

        toggleLoading();
        try {
            const url = status
                ? `${endpoints.teachers.getTeachers}?page=${page}&size=${size}&status=${status}`
                : `${endpoints.teachers.getTeachers}?page=${page}&size=${size}`;

            const response = await axiosInstance.get(url);
            const { data } = response.data;

            setTotalRecords(data.records || 0);

            setTeachers(Array.isArray(data.data) ? data.data.map((teacher) => ({
                id: teacher.id,
                name: teacher.name,
                phoneNumber: teacher.phoneNumber,
                email: teacher.email,
                createdAt: teacher.createdAt,
                status: teacher.status,
            })) : []);
        } catch (error) {
            console.error('Fetch Teachers Error:', error);
        } finally {
            toggleLoading();
        }
    };



    const createTeacher = async (teacherDto, onSuccess) => {
        try {
            const response = await axiosInstance.post(endpoints.teachers.create, teacherDto);
            toast.success(response.data.message || 'Teacher created successfully');
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating teacher');
            console.error('Error creating teacher:', error);         
        }
    };


    const loadTeacherDetails = async (teacherId) => {
        try {
            toggleLoading();
            const response = await axiosInstance.get(`${endpoints.teachers.getTeacher}${teacherId}`);
            toast.success(response.data.message || 'Teacher details loaded successfully');
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching teacher details');
            console.error('Error fetching teacher details:', error);
            throw error;
        } finally {
            toggleLoading();
        }
    };

    const loadTeacherSubjects = async (teacherId) => {
        try {
            toggleLoading();
            const response = await axiosInstance.get(`${endpoints.teachers.getTeacherSubjects}${teacherId}`);
            {/*toast.success(response.data.message || 'Teacher , class and Subject details loaded successfully'); */ }
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching teacher details');
            console.error('Error fetching teacher details:', error);
            throw error;
        } finally {
            toggleLoading();
        }
    };

    const updateTeacherDetails = async (payload) => {
        try {
            const response = await axiosInstance.put(`${endpoints.teachers.update}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating teacher details:', error);
            throw error;
        }
    };

    const updateTeacherStatus = async (teacherId, currentStatus, onSuccess) => {
        const newStatus = currentStatus === 'DISABLED' ? 'ACTIVE' : 'DISABLED';
        const apiUrl = `${endpoints.teachers.status}?id=${teacherId}&status=${newStatus}`;

        try {
            const response = await axiosInstance.post(apiUrl);
            toast.success(response.data.message || 'Teacher status updated successfully');
            onSuccess();
        } catch (error) {
            toast.error('Error updating teacher status.');
            console.error('Error updating teacher status:', error);
        }
    };

    const uploadTeacherImage = async (file) => {
        if (!id || !file) {
            toast.error('User ID or file is missing');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const formData = new FormData();
        formData.append('id', id);
        formData.append('file', file);

        try {
            await axiosInstance.put(`${endpoints.teachers.uploadFile}`, formData, config);
            toast.success('Teacher profile picture updated successfully');
        } catch (error) {
            toast.error('Error uploading teacher image');
            console.error('Error uploading teacher image:', error);
        }
    };

    return {
        teachers,
        totalRecords,
        fetchTeachers,
        createTeacher,
        loadTeacherDetails,
        loadTeacherSubjects,
        updateTeacherDetails,
        updateTeacherStatus,
        uploadTeacherImage,
        isLoading,
    };
};

export default useTeacherService;
