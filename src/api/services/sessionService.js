import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { Response, ErrorResponse, RequestConfig } from '../api-Utils';
import useToggle from '../../hooks/use-toggle';
import toast from 'react-hot-toast';

const useSessionService = () => {
  const [sessions, setSessions] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, toggleLoading] = useToggle();
  const [currentPage, setCurrentPage] = useState(null); // Track last fetched page

  const fetchSessions = useCallback(async (userId, page = 0, size = 10) => {
    
    if (currentPage === page) return; 
    setCurrentPage(page); 

    toggleLoading();
    try {
      const response = await axiosInstance.get(
        `${endpoints.sessions.getUserSessions}?page=${page}&size=${size}&userId=${userId}`
      );

      if (response?.data?.data) {
        const { records, data } = response.data.data;
        setTotalRecords(records);
        setSessions(data || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error(error.response?.data?.message || 'Error fetching sessions');
    } finally {
      toggleLoading();
    }
  }, [currentPage]); // Depend only on currentPage to avoid redundant fetches

  return { sessions, totalRecords, fetchSessions, isLoading };
};

export default useSessionService;
