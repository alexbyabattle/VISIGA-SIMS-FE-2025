import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { Response, ErrorResponse, RequestConfig } from '../api-Utils';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { toast } from 'react-hot-toast';
import useToggle from '../../hooks/use-toggle';


const useParentService = () => {
  const [parents, setParents] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, toggleLoading] = useToggle();

  const user = getUserFromCookies();
  const id = user?.data?.id;

  const fetchParents = async (page, size, status = 'ACTIVE') => {
    toggleLoading();
    try {
      const url = status
        ? `${endpoints.parents.All}?page=${page}&size=${size}&status=${status}`
        : `${endpoints.parents.All}?page=${page}&size=${size}`;

      const response = await axiosInstance.get(url);
      const { data } = response.data;

      setTotalRecords(data.records || 0);

      setParents(
        Array.isArray(data.data)
          ? data.data.map((parent) => ({
            id: parent.id,
            name: parent.parentName,
            phoneNumber: parent.phoneNumber,
            email: parent.email,
            createdAt: parent.createdAt,
            status: parent.status,
          }))
          : []
      );
    } catch (error) {
      toast.error('Error fetching parents.');
      console.error('Fetch Parents Error:', error);
    } finally {
      toggleLoading();
    }
  };

  const createParent = async (parentDto, onSuccess) => {
    try {
      const response = await axiosInstance.post(endpoints.parents.create, parentDto);
      toast.success(response.data.message || 'Parent created successfully');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating parent');
      console.error('Error creating parent:', error);
    }
  };

  const loadParentDetails = async (parentId) => {
    try {
      toggleLoading();
      const response = await axiosInstance.get(`${endpoints.parents.get}${parentId}`);
      //toast.success(response.data.message || 'Parent details loaded successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching parent details');
      console.error('Error fetching parent details:', error);
      throw error;
    } finally {
      toggleLoading();
    }
  };

  const updateParentDetails = async (id, updateParentDto) => {
    try {
      const response = await axiosInstance.put(endpoints.parents.update, updateParentDto);
      return response.data;
    } catch (error) {
      console.error('Error updating parent details:', error);
      throw error;
    }
  };

  const updateParentStatus = async (parentId, currentStatus, onSuccess) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    const apiUrl = `${endpoints.parents.status}?id=${parentId}&status=${newStatus}`;

    try {
      const response = await axiosInstance.post(apiUrl);
      toast.success(response.data.message || 'Parent status updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Error updating parent status.');
      console.error('Error updating parent status:', error);
    }
  };

  const deleteParent = async (id, onSuccess) => {
    try {
      await axiosInstance.delete(`${endpoints.parents.delete}${id}`);
      toast.success('Parent deleted successfully');
      onSuccess();
    } catch (error) {
      toast.error('Error deleting parent');
      console.error('Error deleting parent:', error);
    }
  };

  const assignStudentsToParent = async (parentId, studentIds) => {
    try {
      const response = await axiosInstance.post(`${endpoints.parents.assign}${parentId}`, studentIds);
      toast.success('Students successfully assigned to the parent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error assigning students to parent');
      console.error('Error assigning students to parent:', error);
    }
  };

  const unAssignStudentsFromParent = async (parentId, studentIds) => {
  try {
    const response = await axiosInstance.delete(`${endpoints.parents.unassign}${parentId}`, {
      data: studentIds, 
    });
    toast.success('Students successfully unassigned from the parent');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error unassigning students from parent');
    console.error('Error unassigning students from parent:', error);
  }
};


  const getAssignedStudents = async (parentId) => {
    try {
      toggleLoading();
      const response = await axiosInstance.get(`${endpoints.parents.getAssignments}${parentId}`);
      const assigned = response.data.data;

      return assigned.map((item) => ({
        id: item.id,
        studentParentId: item.studentParentId,
        parentName: item.parentName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        status: item.status,
        createdAt: item.createdAt,
        student: {
          id: item.student?.id,
          name: item.student?.studentName,
          classId: item.student?.clazzId,
          className: item.student?.className,
          parishName: item.student?.parishName,
          archdiocese: item.student?.archdiocese,
          status: item.student?.status,
          createdAt: item.student?.createdAt,
        },
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching assigned students');
      console.error('Error fetching assigned students:', error);
      return [];
    } finally {
      toggleLoading();
    }
  };


  const uploadParentImage = async (file) => {
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
      await axiosInstance.put(`${endpoints.parents.uploadFile}`, formData, config);
      toast.success('Parent profile picture updated successfully');
    } catch (error) {
      toast.error('Error uploading parent image');
      console.error('Error uploading parent image:', error);
    }
  };

  return {
    parents,
    totalRecords,
    fetchParents,
    createParent,
    loadParentDetails,
    updateParentDetails,
    updateParentStatus,
    uploadParentImage,
    deleteParent,
    assignStudentsToParent,
    unAssignStudentsFromParent,
    getAssignedStudents,
    isLoading,
  };
};

export default useParentService;
