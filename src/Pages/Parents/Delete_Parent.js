import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import useParentService from '../../api/services/ParentsService';
import BaseDialog from '../../components/BaseDialog';
import { toast } from 'react-hot-toast';

function DeleteDialog({ open, onClose, userId, currentStatus, onSuccess }) {
    const { updateParentStatus } = useParentService();

    const getActionText = () => {
        return currentStatus === 'ACTIVE' ? 'DISABLE' : 'ENABLE';
    };

    const getNewStatusText = () => {
        return currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    };

    const handleChangeStatus = () => {
        updateParentStatus(userId, currentStatus, () => {
            onSuccess?.();
            onClose();
        });
    };

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            title={`Do you want to ${getActionText()} this parent?`}
            content={`This will change the parent status to ${getNewStatusText()}.`}
            confirmButtonText={getActionText()}
            cancelButtonText="Cancel"
            onConfirm={handleChangeStatus}
            confirmButtonColor={currentStatus === 'ACTIVE' ? 'warning' : 'success'}
            cancelButtonColor="secondary"
        />
    );
}

export default DeleteDialog;
