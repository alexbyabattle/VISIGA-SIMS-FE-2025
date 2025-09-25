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
import useParentService from '../../api/services/ParentsService';
import { toast } from 'react-hot-toast';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { ParentSchema } from '../../schemas/Schemas';

const initialValues = {
    name: '',
    email: '',
    phoneNumber: '',
    createdAt: dayjs(),
};

const CreateParentDialog = ({ open, onClose, onSuccess }) => {
    const { createParent } = useParentService();

    const handleSubmit = async (values) => {
        const parentDto = {
            parentName: values.name,
            email: values.email,
            phoneNumber: values.phoneNumber,
            createdAt: values.createdAt.toISOString(),
            role: "PARENT",
        };

        await createParent(parentDto, () => {
            onSuccess?.();
            onClose();
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>CREATE PARENT</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={ParentSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={12} lg={6}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        error={touched.name && !!errors.name}
                                        helperText={touched.name && errors.name}
                                    />
                                </Grid>

                                <Grid item xs={12} lg={6}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.email}
                                        error={touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                    />
                                </Grid>

                                <Grid item xs={12} lg={6}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Phone Number"
                                        name="phoneNumber"
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.phoneNumber}
                                        error={touched.phoneNumber && !!errors.phoneNumber}
                                        helperText={touched.phoneNumber && errors.phoneNumber}
                                    />
                                </Grid>

                                <Grid item xs={12} lg={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Creation Date"
                                            value={values.createdAt}
                                            onChange={(newValue) =>
                                                setFieldValue('createdAt', newValue)
                                            }
                                            disableFuture
                                            views={['year', 'month', 'day', 'hours', 'minutes']}
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

export default CreateParentDialog;
