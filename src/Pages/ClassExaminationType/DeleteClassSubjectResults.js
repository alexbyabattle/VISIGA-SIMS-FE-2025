import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert
} from '@mui/material';
import useTermService from '../../api/services/termService';
import useClassExamService from '../../api/services/ClassExamsService';
import LoadingSpinner from '../../components/LoadingSpinner';

const DeleteClassSubjectResults = ({
  open,
  onClose,
  onSuccess,
  examinationTypeId,
  subjectId,
  clazzId,
  teacherId
}) => {
  const [selectedTermId, setSelectedTermId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { fetchAllActiveTerms, terms } = useTermService();
  const { deleteClassSubjectResults } = useClassExamService();

  useEffect(() => {
    if (open) {
      loadActiveTerms();
    }
  }, [open]);

  const loadActiveTerms = async () => {
    setIsLoading(true);
    setError('');
    try {
      await fetchAllActiveTerms();
      // The terms will be available in the terms state from the service
    } catch (err) {
      setError('Failed to load terms');
      console.error('Error loading terms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTermId) {
      setError('Please select a term');
      return;
    }

    if (!examinationTypeId || !subjectId || !clazzId || !teacherId) {
      setError('Missing required parameters');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const requestData = {
        clazzId,
        subjectId,
        teacherId,
        examinationTypeId,
        termId: selectedTermId
      };

      await deleteClassSubjectResults(requestData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete results');
      console.error('Error deleting results:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setSelectedTermId('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Delete Class Subject Results
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This action will permanently delete all results for the selected examination type and term.
            Please select a term to proceed with the deletion.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isLoading ? (
            <LoadingSpinner message="Loading terms..." height="100px" />
          ) : (
            <FormControl fullWidth>
              <InputLabel id="term-select-label">Select Term</InputLabel>
              <Select
                labelId="term-select-label"
                value={selectedTermId}
                label="Select Term"
                onChange={(e) => setSelectedTermId(e.target.value)}
                disabled={isDeleting}
              >
                {terms.map((term) => (
                  <MenuItem key={term.id} value={term.id}>
                    {term.termName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={isDeleting}
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          variant="contained"
          disabled={!selectedTermId || isDeleting || isLoading}
        >
          {isDeleting ? 'Deleting...' : 'Delete Results'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteClassSubjectResults;
