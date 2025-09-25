import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { Response, ErrorResponse, RequestConfig } from '../api-Utils';
import useToggle from '../../hooks/use-toggle';
import toast from 'react-hot-toast';

const useClassExamService = () => {
    const [classExams, setClassExams] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, toggleLoading] = useToggle();

    const fetchClassExams = async (teacherId, subjectId, clazzId) => {
        toggleLoading();
        try {
            const url = `${endpoints.examinationType.getClassExams}?teacherId=${teacherId}&subjectId=${subjectId}&clazzId=${clazzId}`;

            const response = await axiosInstance.get(url);
            const { data } = response.data;
            
            setTotalRecords(data.records || 0);

            setClassExams(
                Array.isArray(response.data.data)
                    ? response.data.data.map((classExam) => ({
                        id: classExam.examTypeId,
                        examinationType: classExam.examinationType,
                        createdAt: classExam.createdAt,
                        subjectName: classExam.subjectName,
                        className: classExam.className,
                        classType: classExam.classType,
                        status: classExam.status,
                    }))
                    : []
            );

        } catch (error) {
            toast.error("Error fetching classExams.");
            console.error("Fetch classExams Error:", error);
        } finally {
            toggleLoading();
        }
    };


    const createClassExam = async (classExamDto, onSuccess) => {
        try {
            const response = await axiosInstance.post(endpoints.classExams.create, classExamDto);
            toast.success(response.data.message || 'Class Exam created successfully');
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating classExam');
            console.error('Error creating classExam:', error);
        }
    };

    const deleteClassSubjectResults = async (requestData) => {
        try {
            const response = await axiosInstance.delete(endpoints.results.deleteClassSubjectResults, {
                data: requestData
            });
            toast.success(response.data.message || 'Results deleted successfully');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error deleting results';
            toast.error(errorMessage);
            console.error('Error deleting results:', error);
            throw new Error(errorMessage);
        }
    };

    return {
        classExams,
        totalRecords,
        fetchClassExams,
        createClassExam,
        deleteClassSubjectResults,
        isLoading,
    };
};

export default useClassExamService;
