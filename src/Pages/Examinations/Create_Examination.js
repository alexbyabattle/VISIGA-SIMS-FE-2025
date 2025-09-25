import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    useTheme,
    Grid
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { ExaminationSchema } from '../../schemas/Schemas';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useExaminationService from '../../api/services/examinationService';

const initialValues = {
    examinationName: '',
    examMarks: '',
    createdAt: dayjs(),
};

const CreateDialog = ({ open, onClose, onSuccess }) => {
    const { createExamination } = useExaminationService();

    const handleSubmit = async (values) => {
        const examinationTypeDto = {
            examinationName: values.examinationName,
            examMarks: values.examMarks,
            status: 'ACTIVE',
            createdAt: values.createdAt.toISOString(),
        };

        await createExamination(examinationTypeDto, () => {
            onSuccess?.();
            onClose();
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Examination Type</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={ExaminationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, setFieldValue, handleBlur }) => (
                        <Form>
                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Examination Name"
                                        name="examinationName"
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.examinationName}
                                        error={touched.examinationName && !!errors.examinationName}
                                        helperText={touched.examinationName && errors.examinationName}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Exam Marks"
                                        name="examMarks"
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.examMarks}
                                        error={touched.examMarks && !!errors.examMarks}
                                        helperText={touched.examMarks && errors.examMarks}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Creation Date"
                                            value={values.createdAt}
                                            onChange={(newValue) => setFieldValue('createdAt', newValue)}
                                            disableFuture
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    variant="filled"
                                                    error={touched.createdAt && !!errors.createdAt}
                                                    helperText={touched.createdAt && errors.createdAt}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>

                            <DialogActions sx={{ mt: 2 }}>
                                <Button onClick={onClose} color="secondary">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="secondary">
                                    Save
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default CreateDialog;
