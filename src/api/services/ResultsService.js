import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { Response, ErrorResponse, RequestConfig } from '../api-Utils';
import useToggle from '../../hooks/use-toggle';
import toast from 'react-hot-toast';



const useResultService = () => {

    const [isLoading, toggleLoading] = useToggle();
    const [subject_results, setSubject_results] = useState([]);

    const fetch_subject_results = async ({ teacherId, subjectId, clazzId, examinationTypeId }) => {
        try {
            const url = `${endpoints.results.fetch_subject_results}?clazzId=${clazzId}&subjectId=${subjectId}&examinationTypeId=${examinationTypeId}&teacherId=${teacherId}`;

            const response = await axiosInstance.get(url);
            const { data } = response.data;

            setSubject_results(Array.isArray(data) ? data.map((result) => ({
                id: result.id,
                studentName: result.studentName,
                className: result.className,
                subjectName: result.subjectName,
                combination: result.combination,
                marks: result.marks,
                grade: result.grade,
                createdAt: result.createdAt,
                status: result.status,
            })) : []);
        } catch (error) {
            toast.error('Error fetching subject results.');
            console.error('Fetch Subject Results Error:', error);
        } finally {

        }
    };



    const loadSubjectResultsDetails = async (resultId) => {
        try {
            toggleLoading();
            const response = await axiosInstance.get(`${endpoints.results.getSubjectResults}${resultId}`);
            toast.success(response.data.message || 'Subject results details loaded successfully');
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching teacher details');
            console.error('Error fetching teacher details:', error);
            throw error;
        } finally {
            toggleLoading();
        }
    };


    const loadResultsDetails = async (resultId) => {
        try {
            toggleLoading();
            const response = await axiosInstance.get(`${endpoints.results.getResult}${resultId}`);
            //toast.success(response.data.message || 'Results details loaded successfully');
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching results details');
            console.error('Error fetching result details:', error);
            throw error;
        } finally {
            toggleLoading();
        }
    };


    const sendSmsToParents = async (studentId, payload) => {
        try {
            const response = await axiosInstance.post(
                `${endpoints.results.sendSms}${studentId}`,
                payload
            );
            // toast.success(response.data.message || 'SMS of results is sent successfully');
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error in sending SMS of result details');
            console.error('Error in sending SMS of result details:', error);
            throw error;
        }
    };




    const updateSubjectResultsDetails = async (updateSubjectResultDto) => {
        try {
            const response = await axiosInstance.put(
                `${endpoints.results.update}`,
                updateSubjectResultDto
            );
            //toast.success(response.data.message || 'SubjectResults details updated successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating subject result details');
            console.error('Error updating subject result details:', error);
            throw error;
        }
    };


    const fetchStudentResults = async (classId, examId, studentId) => {
        try {
            const url = `${endpoints.results.StudentResults}?classId=${classId}&examinationTypeId=${examId}&studentId=${studentId}`;
            
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error('Fetch Class Exam Student Results Error:', error);
            if (error.response?.status === 500) {
                toast.error('Server error: Unable to fetch student results. Please check if results exist for this student.');
            } else if (error.response?.status === 404) {
                toast.error('No results found for this student and examination combination.');
            } else {
                toast.error('Error fetching student exam results.');
            }
            throw error;
        } finally {

        }
    };




    const fetchClassResults = async (classId, examId) => {
        try {
            const url = `${endpoints.results.classResults}?classId=${classId}&examinationTypeId=${examId}`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error('Fetch Class Results Error:', error);
            if (error.response?.status === 500) {
                toast.error('Server error: Unable to fetch results. Please check if results exist for this examination.');
            } else if (error.response?.status === 404) {
                toast.error('No results found for this class and examination combination.');
            } else {
                toast.error('Error fetching class results.');
            }
            throw error;
        } finally {

        }
    };


    const generateSubjectResultByExamType = async ({ teacherId, subjectId, termId, clazzId, examinationTypeId, onSuccess, onClose }) => {
        try {
            const postData = {
                clazzId,
                subjectId,
                teacherId,
                examinationTypeId,
                termId,
            };

            const response = await axiosInstance.post(
                endpoints.results.generateSubjectResult,
                postData
            );

            if (response.data?.code === '0') {
                toast.success(response.data.message || 'Subject result initialized successfully');
                onClose?.();
                onSuccess?.();
            } else {
                toast.error(response.data?.message || 'Failed to initialize result');
            }
        } catch (error) {
            toast.error('Class  has  no students');
            console.error('Generate Subject Result Error:', error);
        }
    };


    const getResultsByTermAndClass = async (termId, classId) => {
        try {
            toggleLoading();
            const url = `${endpoints.results.getResultsByTermAndClass}?termId=${termId}&classId=${classId}`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            toast.error('Error fetching results by term and class.');
            console.error('Fetch Results by Term and Class Error:', error);
            throw error;
        } finally {
            toggleLoading();
        }
    };


    const fetchStudentResultsByTerm = async (classId, termId, studentId) => {
        try {
            const url = `${endpoints.results.getResultsByTermClassAndStudent}?termId=${termId}&classId=${classId}`;
            const response = await axiosInstance.get(url);
            if (response.data?.data) {
                return response.data.data.find((s) => s.studentId === studentId);
            }
            return null;
        } catch (error) {
            toast.error("Error fetching student results by term.");
            console.error("Fetch Student Results By Term Error:", error);
            throw error;
        }
    };




    return {
        subject_results,
        fetch_subject_results,
        loadSubjectResultsDetails,
        fetchClassResults,
        updateSubjectResultsDetails,
        loadResultsDetails,
        fetchStudentResults,
        generateSubjectResultByExamType,
        sendSmsToParents,
        getResultsByTermAndClass,
        fetchStudentResultsByTerm,
        isLoading

    };
};

export default useResultService;
