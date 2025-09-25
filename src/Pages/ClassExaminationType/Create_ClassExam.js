import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, useTheme, Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useClassExamService from '../../api/services/ClassExamsService';
import useTermService from '../../api/services/termService';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import useExaminationService from '../../api/services/examinationService';
import useResultService from '../../api/services/ResultsService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const validationSchema = yup.object().shape({
    dateTime: yup.date().required('Date and time is required'),
    selectedExam: yup.object().nullable().required('Examination type is required'),
    selectedTerm: yup.object().nullable().required('Term is required'),
});

function CreateDialog({ open, onClose, teacherId, subjectId, clazzId, onSuccess }) {
    const [examOptions, setExamOptions] = useState([]);
    const { getAllExaminations } = useExaminationService();
    const { generateSubjectResultByExamType } = useResultService();
    const { fetchAllActiveTerms, terms, isLoading } = useTermService();

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                const exams = await getAllExaminations();
                setExamOptions(exams);
            };

            fetchData();
            fetchAllActiveTerms();
        }
    }, [open]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await generateSubjectResultByExamType({
                teacherId,
                subjectId,
                clazzId,
                examinationTypeId: values.selectedExam.id,
                termId: values.selectedTerm.id,
                dateTime: values.dateTime,
            });
            if (onSuccess) onSuccess();
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>INITIALIZE RESULTS FOR SUBJECT</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        dateTime: dayjs(),
                        selectedExam: null,
                        selectedTerm: null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={false}
                >
                    {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                        <Form>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {/* Examination type field */}
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={examOptions}
                                        getOptionLabel={(option) => option?.name || ''}
                                        value={values.selectedExam}
                                        onChange={(event, newValue) => {
                                            setFieldValue('selectedExam', newValue);
                                        }}
                                        isOptionEqualToValue={(option, value) =>
                                            option?.id === value?.id
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Choose Examination Type"
                                                variant="filled"
                                                error={touched.selectedExam && Boolean(errors.selectedExam)}
                                                helperText={touched.selectedExam && errors.selectedExam}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Term select field */}
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Choose Term"
                                        variant="filled"
                                        value={values.selectedTerm?.id || ''}
                                        onChange={(e) => {
                                            const selected = terms.find(t => t.id === e.target.value);
                                            setFieldValue('selectedTerm', selected || null);
                                        }}
                                        error={touched.selectedTerm && Boolean(errors.selectedTerm)}
                                        helperText={touched.selectedTerm && errors.selectedTerm}
                                        disabled={isLoading}
                                    >
                                        {terms.map((term) => (
                                            <MenuItem key={term.id} value={term.id}>
                                                {term.termName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* DateTime Picker */}
                                <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Date & Time"
                                            value={values.dateTime}
                                            onChange={(value) => setFieldValue('dateTime', value)}
                                            disableFuture
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="filled"
                                                    fullWidth
                                                    error={touched.dateTime && Boolean(errors.dateTime)}
                                                    helperText={touched.dateTime && errors.dateTime}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>

                            <DialogActions sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                                <Button onClick={onClose} color="secondary">
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}

export default CreateDialog;
