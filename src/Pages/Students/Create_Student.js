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
import { Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useStudentService from '../../api/services/studentService';
import useClassService from '../../api/services/ClassService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { CreateStudentSchema } from '../../schemas/Schemas';
import { toast } from 'react-hot-toast';

const initialValues = {
    studentName: '',
    combination: '',
    createdAt: dayjs(),
};

const CreateDialog = ({ open, onClose, onSuccess, clazzId }) => {
    const { createStudent } = useStudentService();
    const combinations = ["HGE", "PCM", "PCB", "HGL", "EGM", "O-LEVEL" , "SCIENCE" , "ARTS" , "COMMERCIAL"];

    const handleSubmit = async (values) => {
        const studentDto = {
            studentName: values.studentName,
            combination: values.combination,
            clazzId: clazzId,
            createdAt: values.createdAt.format('YYYY-MM-DD HH:mm:ss'),
        };

        // console.log("student dto is", studentDto);

        await createStudent(studentDto, () => {
            onSuccess?.();
            onClose();
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>CREATE STUDENT</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={CreateStudentSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={12} lg={6}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Full Name"
                                        name="studentName"
                                        variant="filled"
                                        value={values.studentName}
                                        error={touched.studentName && !!errors.studentName}
                                        helperText={touched.studentName && errors.studentName}
                                    />
                                </Grid>

                                <Grid item xs={12} lg={6}>
                                    <Field name="combination">
                                        {({ field, form }) => (
                                            <Autocomplete
                                                options={combinations}
                                                value={field.value || ""}
                                                onChange={(_, newValue) => form.setFieldValue("combination", newValue)}
                                                onBlur={() => form.setFieldTouched("combination", true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Combination"
                                                        variant="filled"
                                                        fullWidth
                                                        error={form.touched.combination && Boolean(form.errors.combination)}
                                                        helperText={form.touched.combination && form.errors.combination}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Field>
                                </Grid>


                                <Grid item xs={12} lg={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Created At"
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
