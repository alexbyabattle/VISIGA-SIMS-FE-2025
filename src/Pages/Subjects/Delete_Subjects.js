import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import useSubjectService from '../../api/services/SubjectService';
import BaseDialog from '../../components/BaseDialog';
import { toast } from 'react-hot-toast';

function DeleteDialog({ open, onClose, subjectId, currentStatus, onSuccess }) {
    const { deleteSubject } = useSubjectService();

    const handleChangeStatus = async () => {
        try {
            await deleteSubject(subjectId, currentStatus, () => {
                onSuccess?.();
                onClose();
            });
            toast.success('Subject deleted successfully!');
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error(error.response?.data?.message || 'Failed to delete subject');
        }
    };

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            title={`Do you want to ${currentStatus === 'ACTIVE' ? 'DELETE' : 'DELETE'} the specified subject?`}
            confirmButtonText={currentStatus === 'ACTIVE' ? 'DELETE' : 'DELETE'}
            cancelButtonText="Cancel"
            onConfirm={handleChangeStatus}
            confirmButtonColor="error"
            cancelButtonColor="secondary"
        />
    );
}

export default DeleteDialog;
