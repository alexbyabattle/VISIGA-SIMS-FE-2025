import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Box,
} from '@mui/material';

const dialogContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80px',
};

function BaseDialog({
    open,
    onClose,
    title,
    confirmButtonText = 'OK',
    cancelButtonText = 'Cancel',
    onConfirm,
    confirmButtonColor = 'error',
    cancelButtonColor = 'secondary',
    children
}) {
    

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <DialogContent style={dialogContentStyle}>
                    <Typography variant="body1">
                        {title}
                    </Typography>
                    {children}
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Box display="flex" justifyContent="center" mt="20px">
                        <Button onClick={onConfirm} color={confirmButtonColor} variant="contained">
                            {confirmButtonText}
                        </Button>
                    </Box>
                    <Box display="flex" justifyContent="center" mt="20px">
                        <Button onClick={onClose} color={cancelButtonColor} variant="contained">
                            {cancelButtonText}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
            
        </>
    );
}

export default BaseDialog;