import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { toast } from 'react-hot-toast';
import useToggle from '../../hooks/use-toggle';

const useStudentEvaluationService = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, toggleLoading] = useToggle();

  // Create new student evaluation (or update if exists)
  const createEvaluation = async (evaluationDto, onSuccess) => {
    try {
      // First check if evaluation already exists
      const exists = await checkEvaluationExists(evaluationDto.termId, evaluationDto.studentId);
      
      if (exists) {
        // If exists, update instead of create
        const response = await updateEvaluationByTermStudent(
          evaluationDto.termId, 
          evaluationDto.studentId, 
          evaluationDto, 
          onSuccess
        );
        return response;
      } else {
        // If doesn't exist, create new
        const response = await axiosInstance.post(endpoints.studentEvaluations.create, evaluationDto);
        toast.success(response.data.message || 'Student evaluation created successfully');
        if (onSuccess) {
          onSuccess();
        }
        return response.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating/updating student evaluation');
      console.error('Error creating/updating student evaluation:', error);
      throw error;
    }
  };

  // Create evaluation by term and student (or update if exists)
  const createEvaluationByTermStudent = async (evaluationDto, onSuccess) => {
    try {
      // First check if evaluation already exists
      const exists = await checkEvaluationExists(evaluationDto.termId, evaluationDto.studentId);
      
      if (exists) {
        // If exists, update instead of create
        const response = await updateEvaluationByTermStudent(
          evaluationDto.termId, 
          evaluationDto.studentId, 
          evaluationDto, 
          onSuccess
        );
        return response;
      } else {
        // If doesn't exist, create new
        const response = await axiosInstance.post(endpoints.studentEvaluations.createByTermStudent, evaluationDto);
        toast.success(response.data.message || 'Student evaluation created successfully');
        if (onSuccess) {
          onSuccess();
        }
        return response.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating/updating student evaluation');
      console.error('Error creating/updating student evaluation:', error);
      throw error;
    }
  };

  // Update student evaluation
  const updateEvaluation = async (evaluationDto, onSuccess) => {
    try {
      const response = await axiosInstance.put(endpoints.studentEvaluations.update, evaluationDto);
      toast.success(response.data.message || 'Student evaluation updated successfully');
      if (onSuccess) {
        onSuccess();
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating student evaluation');
      console.error('Error updating student evaluation:', error);
      throw error;
    }
  };

  // Update evaluation by term and student
  const updateEvaluationByTermStudent = async (termId, studentId, evaluationDto, onSuccess) => {
    try {
      const response = await axiosInstance.put(
        `${endpoints.studentEvaluations.updateByTermStudent}/${termId}/${studentId}`, 
        evaluationDto
      );
      toast.success(response.data.message || 'Student evaluation updated successfully');
      if (onSuccess) {
        onSuccess();
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating student evaluation');
      console.error('Error updating student evaluation:', error);
      throw error;
    }
  };

  // Update evaluation with partial data - only updates non-null fields
  const updatePartialEvaluationByTermStudent = async (termId, studentId, partialDto, onSuccess) => {
    try {
      const response = await axiosInstance.patch(
        `${endpoints.studentEvaluations.updatePartialByTermStudent}/${termId}/${studentId}`, 
        partialDto
      );
      if (onSuccess) {
        onSuccess();
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error partially updating student evaluation');
      console.error('Error partially updating student evaluation:', error);
      throw error;
    }
  };

  // Get all evaluations with pagination
  const fetchEvaluations = async (page = 0, size = 100, status = null) => {
    toggleLoading();
    try {
      const url = status
        ? `${endpoints.studentEvaluations.All}?page=${page}&size=${size}&status=${status}`
        : `${endpoints.studentEvaluations.All}?page=${page}&size=${size}`;

      const response = await axiosInstance.get(url);
      const { data } = response.data;

      setTotalRecords(data.records || 0);

      setEvaluations(
        Array.isArray(data.data)
          ? data.data.map((evaluation) => ({
              id: evaluation.id,
              studentId: evaluation.studentId,
              studentName: evaluation.studentName,
              termId: evaluation.termId,
              termName: evaluation.termName,
              spiritualLife: evaluation.spiritualLife,
              academicLife: evaluation.academicLife,
              manualWork: evaluation.manualWork,
              health: evaluation.health,
              leadershipSkills: evaluation.leadershipSkills,
              sports: evaluation.sports,
              debts: evaluation.debts,
              firstTermFee: evaluation.firstTermFee,
              secondTermFee: evaluation.secondTermFee,
              firstTermExamFee: evaluation.firstTermExamFee,
              secondTermExamFee: evaluation.secondTermExamFee,
              firstTermOtherContribution: evaluation.firstTermOtherContribution,
              secondTermOtherContribution: evaluation.secondTermOtherContribution,
              rectorComments: evaluation.rectorComments,
              dateOfOpening: evaluation.dateOfOpening,
            }))
          : []
      );
    } catch (error) {
      toast.error('Error fetching student evaluations');
      console.error('Fetch Student Evaluations Error:', error);
    } finally {
      toggleLoading();
    }
  };

  // Get evaluation by ID
  const getEvaluationById = async (evaluationId) => {
    try {
      toggleLoading();
      const response = await axiosInstance.get(`${endpoints.studentEvaluations.get}${evaluationId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching student evaluation');
      console.error('Error fetching student evaluation:', error);
      throw error;
    } finally {
      toggleLoading();
    }
  };

  // Get evaluation by term and student
  const getEvaluationByTermStudent = async (termId, studentId) => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.studentEvaluations.getByTermStudent}/${termId}/${studentId}`
      );
      return response.data.data;
    } catch (error) {
      // Don't show toast for 404 errors (evaluation doesn't exist)
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || 'Error fetching student evaluation');
      }
      console.error('Error fetching student evaluation:', error);
      throw error;
    }
  };

  // Get evaluation by term ID and student ID (corresponds to backend getByTermIdAndStudentId)
  const getEvaluationByTermIdAndStudentId = async (termId, studentId) => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.studentEvaluations.getByTermStudent}/${termId}/${studentId}`
      );
      return response.data.data;
    } catch (error) {
      // Don't show toast for 404 errors (evaluation doesn't exist)
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || 'Error fetching student evaluation');
      }
      console.error('Error fetching student evaluation:', error);
      throw error;
    }
  };

  // Get all evaluations for a specific student
  const getEvaluationsByStudent = async (studentId) => {
    try {
      toggleLoading();
      const response = await axiosInstance.get(`${endpoints.studentEvaluations.getByStudent}/${studentId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching student evaluations');
      console.error('Error fetching student evaluations:', error);
      throw error;
    } finally {
      toggleLoading();
    }
  };

  // Get all evaluations for a specific term
  const getEvaluationsByTerm = async (termId) => {
    try {
      toggleLoading();
      const response = await axiosInstance.get(`${endpoints.studentEvaluations.getByTerm}/${termId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching student evaluations');
      console.error('Error fetching student evaluations:', error);
      throw error;
    } finally {
      toggleLoading();
    }
  };

  // Check if evaluation exists for term and student
  const checkEvaluationExists = async (termId, studentId) => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.studentEvaluations.exists}/${termId}/${studentId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error checking evaluation existence:', error);
      return false;
    }
  };

  // Change evaluation status
  const changeEvaluationStatus = async (evaluationId, status, onSuccess) => {
    try {
      const response = await axiosInstance.post(
        `${endpoints.studentEvaluations.status}?id=${evaluationId}&status=${status}`
      );
      toast.success(response.data.message || 'Student evaluation status updated');
      if (onSuccess) {
        onSuccess();
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating evaluation status');
      console.error('Error updating evaluation status:', error);
      throw error;
    }
  };

  return {
    evaluations,
    totalRecords,
    isLoading,
    createEvaluation,
    createEvaluationByTermStudent,
    updateEvaluation,
    updateEvaluationByTermStudent,
    updatePartialEvaluationByTermStudent,
    fetchEvaluations,
    getEvaluationById,
    getEvaluationByTermStudent,
    getEvaluationByTermIdAndStudentId,
    getEvaluationsByStudent,
    getEvaluationsByTerm,
    checkEvaluationExists,
    changeEvaluationStatus,
  };
};

export default useStudentEvaluationService;
