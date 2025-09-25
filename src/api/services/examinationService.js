import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { Response, ErrorResponse, RequestConfig } from '../api-Utils';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import toast from 'react-hot-toast';
import useToggle from '../../hooks/use-toggle';


const useExaminationService = () => {
    const [examinations, setExaminations] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, toggleLoading] = useToggle();

    const user = getUserFromCookies();
    const id = user?.data?.id;

    const fetchExaminations = async (page, size, status = null) => {

        try {
            const url = status
                ? `${endpoints.examinationType.getExams}?page=${page}&size=${size}&status=${status}`
                : `${endpoints.examinationType.getExams}?page=${page}&size=${size}`;

            const response = await axiosInstance.get(url);
            const { data } = response.data;

            setTotalRecords(data.records || 0);

            setExaminations(Array.isArray(data.data) ? data.data.map((exam) => ({
                
                id: exam.id,
                examinationName: exam.examinationName,
                examMarks: exam.examMarks,
                createdAt: exam.createdAt,
                status: exam.status,

            })) : []);
        } catch (error) {
            toast.error('Error fetching examination types.');
            console.error('Fetch Examinations Error:', error);
        } finally {

        }
    };

    const createExamination = async (examinationDto, onSuccess) => {
        try {
            const response = await axiosInstance.post(endpoints.examinationType.create, examinationDto);
            toast.success(response.data.message || 'Examination type created successfully');
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating examination type');
            console.error('Error creating examination type:', error);
        }
    };

    const fetchExaminationTypesByClassId = async (classId, onSuccess) => {
        try {
            const url = `${endpoints.results.getExamByClassId}?classId=${classId}`;
            const response = await axiosInstance.get(url);
            const types = response.data.data;
            // console.log("exam details  are", types);

            const mappedTypes = Array.isArray(types)
                ? types.map((exam, index) => ({
                    id: exam.examTypeId,
                    examinationName: exam.examinationType,
                    examMarks: exam.examMarks,
                    createdAt: exam.createdAt,
                    classId: exam.classId,
                    status: exam.status,
                    className: exam.className,
                    classType: exam.classType,
                }))
                : [];


            //toast.success('Examinations listed successfully');

            if (onSuccess) {
                onSuccess(mappedTypes);
            }

            return mappedTypes;
        } catch (error) {
            console.error(error.response?.data?.message);
            return [];
        }
    };



    const getAllExaminations = async () => {
        try {
            const response = await axiosInstance.get(endpoints.examinationType.getAll);
            const data = response.data?.data || [];

            return data.map((exam) => ({
                id: exam.id,
                name: exam.examinationName,
            }));
        } catch (error) {
            toast.error('Error fetching all examination types.');
            console.error('Get All Examinations Error:', error);
            return []; // fallback
        }
    };




    const loadExaminationDetails = async (examinationId) => {
        try {

            const response = await axiosInstance.get(`${endpoints.examinationType.getExaminationType}${examinationId}`);
            toast.success(response.data.message || 'Examination type details loaded successfully');
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching examination details');
            console.error('Error fetching examination details:', error);
            throw error;
        } finally {

        }
    };

    const updateExaminationDetails = async (payload) => {
        try {
            const response = await axiosInstance.put(`${endpoints.examinationType.update}`, payload);
            toast.success(response.data.message || 'Examination type updated successfully');
            return response.data;
        } catch (error) {
            toast.error('Error updating examination type');
            console.error('Error updating examination type:', error.response?.data?.message);
            throw error;
        }
    };

    const deleteExamination = async (examinationId, currentStatus, onSuccess) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'DISABLED';
        const apiUrl = `${endpoints.examinationType.delete}?id=${examinationId}&status=${newStatus}`;

        try {
            const response = await axiosInstance.post(apiUrl);
            toast.success(response.data.message || 'Examination type status updated successfully');
            onSuccess();
        } catch (error) {
            toast.error('Error updating examination type status.');
            console.error('Error updating examination type status:', error);
        }
    };


    const rotateExaminationStatus = async (examinationId, onSuccess) => {
        try {
            const response = await axiosInstance.post(
                `${endpoints.examinationType.publish}`,
                null,
                { params: { id: examinationId } }
            );

            toast.success('Examination status rotated successfully');

            if (typeof onSuccess === "function") {
                onSuccess();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error rotating examination status');
            console.error('Error rotating examination status:', error);
        }
    };


    return {
        examinations,
        totalRecords,
        fetchExaminations,
        getAllExaminations,
        createExamination,
        loadExaminationDetails,
        updateExaminationDetails,
        deleteExamination,
        fetchExaminationTypesByClassId,
        rotateExaminationStatus,
        isLoading,
    };
};

export default useExaminationService;
