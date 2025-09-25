import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import useTeacherService from '../../api/services/teacherService';
import BaseDialog from '../../components/BaseDialog';
import { toast } from 'react-hot-toast';

function DeleteDialog({ open, onClose, teacherId, currentStatus }) {
    const { updateTeacherStatus } = useTeacherService();

    const handleChangeStatus = () => {
        updateTeacherStatus(teacherId, currentStatus, onClose);
    };

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            title={`Do you want to ${currentStatus === 'ACTIVE' ? 'DELETE' : 'DELETE'} the specified user?`}
            confirmButtonText={currentStatus === 'ACTIVE' ? 'DELETE' : 'DELETE'}
            cancelButtonText="Cancel"
            onConfirm={handleChangeStatus}
            confirmButtonColor="error"
            cancelButtonColor="secondary"
        />
    );
}

export default DeleteDialog;
