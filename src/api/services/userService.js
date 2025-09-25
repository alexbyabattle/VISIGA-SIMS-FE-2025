import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { Response, ErrorResponse, RequestConfig } from '../api-Utils';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useToggle from '../../hooks/use-toggle';
import { toast } from 'react-hot-toast';

const useUserService = () => {
    const [users, setUsers] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, toggleLoading] = useToggle();
    
    const user = getUserFromCookies();
    const id = user?.data?.id;

    const fetchUsers = async (page, size, status = null) => {
        toggleLoading();
        try {
            const url = status
                ? `${endpoints.users.getUsers}?page=${page}&size=${size}&status=${status}`
                : `${endpoints.users.getUsers}?page=${page}&size=${size}`;
            
            const response = await axiosInstance.get(url);
            const { data } = response.data;

            // Ensure totalRecords is correctly assigned
            setTotalRecords(data.records || 0);

            // Ensure users is always an array
            setUsers(Array.isArray(data.data) ? data.data.map((user) => ({
                id: user.id,
                userName: user.name,
                phoneNumber: user.phoneNumber,
                indexNumber: user.studentNumber,
                email: user.email,
                parishName: user.parishName,
                archdiocese: user.archdiocese,
                communityName: user.communityName,
                status: user.status,
                role: user.role,
                gender: user.gender,
                createdAt: user.createdAt,
            })) : []);

        } catch (error) {
            toast.error('Error fetching users.');
            console.error('Fetch Users Error:', error);
        } finally {
            toggleLoading();
        }
    };

    const loadUserDetails = async (userId) => {
        try {
            toggleLoading();
            const response = await axiosInstance.get(`${endpoints.users.getUser}${userId}`);
            //toast.success(response.data.message || 'User details loaded successfully');
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching user details');
            console.error('Error fetching user details:', error);
            throw error;
        } finally {
            toggleLoading();
        }
    };



    const createUser = async (userDto) => {
        try {
            const response = await axiosInstance.post(endpoints.users.signUp, userDto);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    };
        
    const updateUserDetails = async (id, updateUserDetailsDto) => {
        try {
            const response = await axiosInstance.put(`${endpoints.users.update}${id}`, updateUserDetailsDto);
            return response.data;
        } catch (error) {
            console.error('Error updating user details:', error);
            throw error;
        }
    };

    const updateUserStatus = async (userId, currentStatus, onSuccess) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
        const apiUrl = `${endpoints.users.status}?id=${userId}&status=${newStatus}`;
        
        try {
            const response = await axiosInstance.post(apiUrl);
            if (onSuccess) {
                onSuccess();
            }
            return response.data;
        } catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    };

    const changeUserStatus = async (userId, status) => {
        try {
            const response = await axiosInstance.post(`${endpoints.users.status}?id=${userId}&status=${status}`);
            return response.data;
        } catch (error) {
            console.error('Error changing user status:', error);
            throw error;
        }
    };

    const deleteUser = async (userId, currentStatus, onSuccess) => {
        const newStatus = 'DISABLED';
        const apiUrl = `${endpoints.users.status}?id=${userId}&status=${newStatus}`;
        
        try {
            const response = await axiosInstance.post(apiUrl);
            if (onSuccess) {
                onSuccess();
            }
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    };


    const changePassword = async (userId, changePasswordDto) => {
        try {
            const response = await axiosInstance.post(`${endpoints.users.changePassword}?userId=${userId}`, changePasswordDto);
            toast.success(response.data.message || 'User details updated successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating user details');
            console.error('Error updating user details:', error);
            throw error;
        }
    };

    const uploadUserImage = async (file) => {
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
            await axiosInstance.put(`${endpoints.users.uploadFile}`, formData, config);
            toast.success('Profile picture updated successfully');
        } catch (error) {
            toast.error('Error updating profile picture');
            console.error('Error updating profile picture:', error);
        }
    };


    

    return {
        users,
        totalRecords,
        changePassword,
        fetchUsers,
        loadUserDetails,
        createUser,
        updateUserDetails,
        updateUserStatus,
        changeUserStatus,
        deleteUser,
        uploadUserImage,
        isLoading,
    };
};

export default useUserService;
