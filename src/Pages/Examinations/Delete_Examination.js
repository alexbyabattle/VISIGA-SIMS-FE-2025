import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import useExaminationService from '../../api/services/examinationService';
import BaseDialog from '../../components/BaseDialog';
import { toast } from 'react-hot-toast';

function DeleteDialog({ open, onClose, examinationId, currentStatus }) {

    const { deleteExamination } = useExaminationService();

    const handleChangeStatus = () => {
        deleteExamination(examinationId, currentStatus, onClose);
    };

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            title={`Do you want to ${currentStatus === 'ACTIVE' ? 'DELETE' : 'DELETE'} the specified exam?`}
            confirmButtonText={currentStatus === 'ACTIVE' ? 'DELETE' : 'DELETE'}
            cancelButtonText="Cancel"
            onConfirm={handleChangeStatus}
            confirmButtonColor="error"
            cancelButtonColor="secondary"
        />
    );
}

export default DeleteDialog;
