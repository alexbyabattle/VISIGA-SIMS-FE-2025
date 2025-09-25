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
    useTheme
} from '@mui/material';
import { Formik } from 'formik';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useClassService from '../../api/services/ClassService';
import { toast } from 'react-hot-toast';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Form, Field } from 'formik';
import { ClassSchema } from '../../schemas/classSchema';
import dayjs from 'dayjs';
import { Autocomplete } from '@mui/material';
import { Grid } from '@mui/material';

const initialValues = {
    className: '',
    createdDate: dayjs(),
};


const CreateDialog = ({ open, onClose, onSuccess }) => {
    const { createClass } = useClassService();
    const combinations = ["A-LEVEL", "O-LEVEL"];

    const handleSubmit = async (values) => {
        const classDto = {
            className: values.className,
            classType: values.classType,
        };

        await createClass(classDto, () => {
            onSuccess?.();
            onClose();
        });
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>CREATE CLASS</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={ClassSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                        <Form>
                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={12} lg={6}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="ClassName"
                                        name="className"
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.className}
                                        error={touched.className && !!errors.className}
                                        helperText={touched.className && errors.className}
                                    />
                                </Grid>

                                <Grid item xs={12} lg={6}>
                                    <Field name="classType">
                                        {({ field, form }) => (
                                            <Autocomplete
                                                options={combinations}
                                                value={field.value || ""}
                                                onChange={(_, newValue) => form.setFieldValue("classType", newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Class Type"
                                                        variant="filled"
                                                        fullWidth
                                                        error={form.touched.classType && Boolean(form.errors.classType)}
                                                        helperText={form.touched.classType && form.errors.classType}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Field>
                                </Grid>



                                <Grid item xs={12} lg={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Creation Date"
                                            value={values.createdDate}
                                            onChange={(newValue) =>
                                                handleChange({
                                                    target: { name: 'createdDate', value: newValue },
                                                })
                                            }
                                            disableFuture
                                            views={['year', 'month', 'day', 'hours', 'minutes']}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    variant="filled"
                                                    error={touched.createdDate && !!errors.createdDate}
                                                    helperText={touched.createdDate && errors.createdDate}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>

                            <DialogActions sx={{ mt: 2 }}>
                                <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'SAVE'}
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
