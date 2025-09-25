import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import useUserService from '../../api/services/userService';
import BaseDialog from '../../components/BaseDialog';
import { toast } from 'react-hot-toast';

function DeleteUserDialog({ open, onClose, userId, currentStatus, onSuccess }) {
    const { changeUserStatus } = useUserService();

    const handleDelete = async () => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
            await changeUserStatus(userId, newStatus);
            toast.success(`User status changed to ${newStatus} successfully!`);
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Status change failed:', error);
            toast.error(error.response?.data?.message || 'Failed to change user status');
        }
    };

    const getActionText = () => {
        return currentStatus === 'ACTIVE' ? 'DISABLE' : 'ENABLE';
    };

    const getNewStatusText = () => {
        return currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    };

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            title={`Do you want to ${getActionText()} this user?`}
            content={`This will change the user status to ${getNewStatusText()}.`}
            confirmButtonText={getActionText()}
            cancelButtonText="Cancel"
            onConfirm={handleDelete}
            confirmButtonColor={currentStatus === 'ACTIVE' ? 'warning' : 'success'}
            cancelButtonColor="secondary"
        />
    );
}

export default DeleteUserDialog;
