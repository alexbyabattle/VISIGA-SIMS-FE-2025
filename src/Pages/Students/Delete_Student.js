import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import useStudentService from '../../api/services/studentService';
import BaseDialog from '../../components/BaseDialog';
import { toast } from 'react-hot-toast';

function DeleteDialog({ open, onClose, studentId, currentStatus }) {
    const { deleteStudent } = useStudentService();

    const handleChangeStatus = () => {
        deleteStudent( studentId, currentStatus, onClose );
    };

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            title={`Do you want to ${currentStatus === 'ACTIVE' ? 'DELETE' : 'DELETE'} the specified student?`}
            confirmButtonText={currentStatus === 'ACTIVE' ? 'DISABLED' : 'DISABLED'}
            cancelButtonText="Cancel"
            onConfirm={handleChangeStatus}
            confirmButtonColor="error"
            cancelButtonColor="secondary"
        />
    );
}

export default DeleteDialog;
