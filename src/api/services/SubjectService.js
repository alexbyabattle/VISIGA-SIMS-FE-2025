import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { toast } from 'react-hot-toast';

const useSubjectService = () => {
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Removed unused: totalRecords, setTotalRecords, id

    const fetchSubjects = async (page = 0, size = 100, status = null) => {
        setIsLoading(true);
        try {
            const url = status
                ? `${endpoints.subject.All}?page=${page}&size=${size}&status=${status}`
                : `${endpoints.subject.All}?page=${page}&size=${size}`;

            const response = await axiosInstance.get(url);
            const { data } = response.data;

            setSubjects(Array.isArray(data.data) ? data.data.map((subjects) => ({
                id: subjects.id,
                subjectName: subjects.subjectName,
                createdAt: subjects.createdAt,
                status: subjects.status,
            })) : []);
        } catch (error) {
            if (!toast.isActive('fetch-subjects-error')) {
                toast.error('Error fetching subjects.', { id: 'fetch-subjects-error' });
            }
            // eslint-disable-next-line no-console
            console.error('Fetch Subjects Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createSubject = async (subjectDto, onSuccess) => {
        try {
            const response = await axiosInstance.post(endpoints.subject.create, subjectDto);
            if (onSuccess) {
                onSuccess();
            }
            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error creating subject:', error);
            throw error; // Re-throw the error so component can handle it
        }
    };

    const loadSubjectDetails = async (subjectId) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(`${endpoints.subject.get}${subjectId}`);
            return response.data.data;
        } catch (error) {
            if (!toast.isActive('load-subject-error')) {
                toast.error(error.response?.data?.message || 'Error fetching subject details', { id: 'load-subject-error' });
            }
            // eslint-disable-next-line no-console
            console.error('Error fetching subject details:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loadClassAndTeacherDetails = async (subjectId) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(`${endpoints.subject.details}${subjectId}`);
            return response.data.data;
        } catch (error) {
            if (!toast.isActive('load-class-teacher-error')) {
                toast.error(error.response?.data?.message || 'Error fetching subject details', { id: 'load-class-teacher-error' });
            }
            // eslint-disable-next-line no-console
            console.error('Error fetching subject details:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateSubjectDetails = async (updateSubjectDto) => {
        try {
           
            const response = await axiosInstance.put(`${endpoints.subject.update}`, updateSubjectDto);
           
            return response.data;
        } catch (error) {
            console.error('Service: Error updating subject details:', error);
            throw error;
        }
    };

    const deleteSubject = async (subjectId, currentStatus, onSuccess) => {
        const newStatus = 'DELETED';
        const apiUrl = `${endpoints.subject.delete}?id=${subjectId}&status=${newStatus}`;

        try {
            const response = await axiosInstance.post(apiUrl);
            if (onSuccess) {
                onSuccess();
            }
            return response.data;
        } catch (error) {
            console.error('Error deleting subject status:', error);
            throw error;
        }
    };

    const assignTeacherToSubject = async (subjectId, teacherIds, clazzId) => {
        try {
            const response = await axiosInstance.post(
                `${endpoints.subject.assign}?subjectId=${subjectId}&classId=${clazzId}`,
                teacherIds
            );
            return response.data;
        } catch (error) {
            console.error('Error assigning teachers to subject:', error);
            throw error;
        }
    };

    return {
        subjects,
        fetchSubjects,
        createSubject,
        loadSubjectDetails,
        updateSubjectDetails,
        deleteSubject,
        assignTeacherToSubject,
        loadClassAndTeacherDetails,
        isLoading,
    };
};

export default useSubjectService;
