import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const SignOutDialog = ({ open, onClose }) => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogoutConfirm = async () => {
    setLoading(true);
    try {
      await signOut(); 
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80px'
        }}
      >
        <Typography variant="body1">Do you want to logout?</Typography>
      </DialogContent>

      <DialogActions style={{ justifyContent: 'center' }}>
        <Box display="flex" justifyContent="center" mt="20px" gap={2}>
          <Button
            onClick={handleLogoutConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="secondary" /> : 'Logout'}
          </Button>

          <Button
            onClick={onClose}
            color="secondary"
            variant="contained"
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SignOutDialog;
