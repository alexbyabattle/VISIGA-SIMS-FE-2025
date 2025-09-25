import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import useClassService from '../../api/services/ClassService';
import BaseDialog from '../../components/BaseDialog';
import { toast } from 'react-hot-toast';

function DeleteDialog({ open, onClose, classId, currentStatus }) {
    const { updateClassStatus } = useClassService();

    const targetStatus = currentStatus === 'GRADUATE' ? 'ONGOING' : 'GRADUATE';

    const handleChangeStatus = () => {
        updateClassStatus(classId, currentStatus, onClose);
    };

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            title={`Do you want to change the class status to ${targetStatus}?`}
            confirmButtonText={`Set to ${targetStatus}`}
            cancelButtonText="Cancel"
            onConfirm={handleChangeStatus}
            confirmButtonColor={targetStatus === 'GRADUATE' ? 'error' : 'primary'}
            cancelButtonColor="secondary"
        />
    );
}

export default DeleteDialog;
