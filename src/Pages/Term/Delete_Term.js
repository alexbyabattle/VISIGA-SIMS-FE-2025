import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Grid, Card, CardContent, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate, useParams } from "react-router-dom";
import useTermService from '../../api/services/termService';
import BaseDialog from '../../components/BaseDialog';
import * as image from '../../assets';
import LoadingSpinner from '../../components/LoadingSpinner';
import Header from "../../components/Header";
import toast from 'react-hot-toast';

function DeleteDialog({ open, onClose, termId, currentStatus }) {
    const { updateTermStatus } = useTermService();

    const handleChangeStatus = () => {
        updateTermStatus(termId, currentStatus, onClose);
    };

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            title={`Do you want to ${currentStatus === 'ACTIVE' ? 'DELETE' : 'DELETE'} the specified term?`}
            confirmButtonText={currentStatus === 'ACTIVE' ? 'DELETE' : 'DELETE'}
            cancelButtonText="Cancel"
            onConfirm={handleChangeStatus}
            confirmButtonColor="error"
            cancelButtonColor="secondary"
        />
    );
}

export default DeleteDialog;
