import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import toast from 'react-hot-toast';

const useClassService = () => {
    const [classes, setClasses] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading] = useState(false); // removed setIsLoading since it's unused

    // Removed unused: id

    const fetchClasses = async (page, size, status = null) => {
        try {
            const url = status
                ? `${endpoints.class.getClasses}?page=${page}&size=${size}&status=${status}`
                : `${endpoints.class.getClasses}?page=${page}&size=${size}`;

            const response = await axiosInstance.get(url);
            const { data } = response.data;

            setTotalRecords(data.records || 0);

            setClasses(Array.isArray(data.data) ? data.data.map((classes) => ({
                id: classes.id,
                className: classes.className,
                classType: classes.classType,
                createdAt: classes.createdAt,
                status: classes.status,
            })) : []);
        } catch (error) {
            toast.error('Error fetching classes.');
            // eslint-disable-next-line no-console
            console.error('Fetch Classes Error:', error);
        }
    };

    const createClass = async (classDto, onSuccess) => {
        try {
            const response = await axiosInstance.post(endpoints.class.create, classDto);
            toast.success(response.data.message || 'Class created successfully');
            onSuccess();
        } catch (error) {
            toast.error('Error creating class');
        }
    };

    const getClassById = async (classId) => {
        try {
            const response = await axiosInstance.get(`${endpoints.class.getClass}${classId}`);
            return response.data.data;
        } catch (error) {
            toast.error('Error fetching class details');
            // eslint-disable-next-line no-console
            console.error(error.response?.data?.message);
            throw error;
        }
    };

    const loadClassDetails = async (classId) => {
        try {
            const response = await axiosInstance.get(`${endpoints.class.getClassDetails}${classId}`);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching class details');
            // eslint-disable-next-line no-console
            console.error(error.response?.data?.message);
            throw error;
        }
    };

    const updateClassDetails = async (payload) => {
        try {
            const response = await axiosInstance.put(`${endpoints.class.update}`, payload);
            toast.success(response.data.message || 'Class details updated successfully');
            return response.data;
        } catch (error) {
            toast.error('Error updating class details');
            // eslint-disable-next-line no-console
            console.error(error.response?.data?.message);
            throw error;
        }
    };

    const updateClassStatus = async (classId, currentStatus, onSuccess) => {
        const newStatus = currentStatus === 'GRADUATED' ? 'ONGOING' : 'GRADUATED';
        const apiUrl = `${endpoints.class.status}?id=${classId}&status=${newStatus}`;

        try {
            const response = await axiosInstance.post(apiUrl);
            toast.success(response.data.message || `Class status changed to ${newStatus}`);
            onSuccess();
        } catch (error) {
            toast.error('Error updating class status.');
            // eslint-disable-next-line no-console
            console.error(error.response?.data?.message);
        }
    };

    const assignSubjectsToClass = async (clazzId, subjectIds) => {
        try {
            await axiosInstance.post(`${endpoints.class.assign}${clazzId}`, subjectIds);
            toast.success('Subjects successfully assigned to the class');
        } catch (error) {
            toast.error('Error assigning subjects to class');
            // eslint-disable-next-line no-console
            console.error(error.response?.data?.message);
        }
    };

    const unAssignSubjectsFromClass = async (clazzId, subjectIds) => {
        try {
            await Promise.all(
                subjectIds.map(subjectId =>
                    axiosInstance.delete(`${endpoints.class.unassign}${clazzId}`, {
                        params: { subjectId },
                    })
                )
            );
            toast.success('Subjects successfully unassigned from the class');
        } catch (error) {
            toast.error('Error unassigning subjects from class');
            // eslint-disable-next-line no-console
            console.error(error.response?.data?.message || error.message);
        }
    };

    const changeToGraduateStatus = async (classId) => {
        try {
            const response = await axiosInstance.post(`${endpoints.class.GraduateStatus}${classId}`);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error in Changing class and student status');
            // eslint-disable-next-line no-console
            console.error(error.response?.data?.message);
            throw error;
        }
    };

    return {
        classes,
        totalRecords,
        fetchClasses,
        createClass,
        loadClassDetails,
        unAssignSubjectsFromClass,
        updateClassDetails,
        updateClassStatus,
        getClassById,
        isLoading,
        assignSubjectsToClass,
        changeToGraduateStatus,
    };
};

export default useClassService;
