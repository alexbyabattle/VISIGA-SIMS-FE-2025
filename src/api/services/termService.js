import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { Response, ErrorResponse, RequestConfig } from '../api-Utils';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import toast from 'react-hot-toast';
import useToggle from '../../hooks/use-toggle';


const useTermService = () => {
  const [terms, setTerms] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, toggleLoading] = useToggle();

  const user = getUserFromCookies();
  const id = user?.data?.id;

  const fetchTerms = async (_page, _size, status = null) => {
    const page = _page ?? 0;
    const size = _size ?? 100;

    toggleLoading();
    try {
      const url = status
        ? `${endpoints.terms.getTerms}?page=${page}&size=${size}&status=${status}`
        : `${endpoints.terms.getTerms}?page=${page}&size=${size}`;

      const response = await axiosInstance.get(url);
      const { data } = response.data;

      setTotalRecords(data.records || 0);

      setTerms(
        Array.isArray(data.data)
          ? data.data.map((term) => ({
              id: term.id,
              termName: term.termName,
              createdAt: term.createdAt,
              status: term.status,
            }))
          : []
      );
    } catch (error) {
      console.error('Fetch Terms Error:', error);
    } finally {
      toggleLoading();
    }
  };


  const fetchAllActiveTerms = async (_page, _size, status = "ACTIVE") => {
    const page = _page ?? 0;
    const size = _size ?? 100;

    toggleLoading();
    try {
      const url = status
        ? `${endpoints.terms.getTerms}?page=${page}&size=${size}&status=${status}`
        : `${endpoints.terms.getTerms}?page=${page}&size=${size}`;

      const response = await axiosInstance.get(url);
      const { data } = response.data;

      setTotalRecords(data.records || 0);

      // Ensure `data.data` is treated as an array (fallback to [])
      const termData = Array.isArray(data?.data) ? data.data : [];
      setTerms(
        termData.map((term) => ({
          id: term.id,
          termName: term.termName,
          createdAt: term.createdAt,
          status: term.status,
        }))
      );
    } catch (error) {
      console.error('Fetch Terms Error:', error);
      setTerms([]); // Explicitly reset to empty array on error
    } finally {
      toggleLoading();
    }
  };


  const createTerm = async (termDto, onSuccess) => {
    try {
      const response = await axiosInstance.post(endpoints.terms.create, termDto);
      toast.success(response.data.message || 'Term created successfully');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating term');
      console.error('Error creating term:', error);
    }
  };

  const loadTermDetails = async (termId) => {
    try {
      toggleLoading();
      const response = await axiosInstance.get(`${endpoints.terms.getTerm}${termId}`);
      toast.success(response.data.message || 'Term details loaded successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching term details');
      console.error('Error fetching term details:', error);
      throw error;
    } finally {
      toggleLoading();
    }
  };

  const updateTermDetails = async (payload) => {
    try {
      const response = await axiosInstance.put(`${endpoints.terms.update}`, payload);
      toast.success(response.data.message || 'Term details updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating term details');
      console.error('Error updating term details:', error);
      throw error;
    }
  };

  const updateTermStatus = async (termId, currentStatus, onSuccess) => {
    const newStatus = currentStatus === 'DISABLED' ? 'ACTIVE' : 'DISABLED';
    const apiUrl = `${endpoints.terms.status}?id=${termId}&status=${newStatus}`;

    try {
      const response = await axiosInstance.post(apiUrl);
      toast.success(response.data.message || 'Term status updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Error updating term status.');
      console.error('Error updating term status:', error);
    }
  };

  const rotateTermStatus = async (termId, onSuccess) => {
    try {
      const response = await axiosInstance.post(
        `${endpoints.terms.rotateStatus}`,
        null,
        { params: { id: termId } }
      );

      toast.success('Term status rotated successfully');

      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rotating term status');
      console.error('Error rotating term status:', error);
    }
  };


  const GetTermsByClassId = async (classId, onSuccess) => {
        try {
            const url = `${endpoints.results.getTermsByClassId}?classId=${classId}`;
            const response = await axiosInstance.get(url);
            const types = response.data.data;
            

            const mappedTerms = Array.isArray(types)
                ? types.map((exam, index) => ({
                    id: exam.termId,
                    termName: exam.termName,
                    createdAt: exam.createdAt,
                    classId: exam.classId,
                    status: exam.status,
                    className: exam.className,
                    classType: exam.classType,
                }))
                : [];


            //toast.success('Examinations listed successfully');

            if (onSuccess) {
                onSuccess(mappedTerms);
            }

            return mappedTerms;
        } catch (error) {
            console.error(error.response?.data?.message);
            return [];
        }
    };

  return {
    terms,
    totalRecords,
    fetchTerms,
    createTerm,
    loadTermDetails,
    updateTermDetails,
    updateTermStatus,
    rotateTermStatus,
    fetchAllActiveTerms,
    GetTermsByClassId,
    isLoading,
  };
};

export default useTermService;
