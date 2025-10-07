import React, { useState } from 'react';
import {
    Button,
    TextField,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { ChangePasswordSchema } from '../../schemas/Schemas';
import useUserService from '../../api/services/userService';
import { getUserFromCookies } from '../../utils/Cookie-utils';

const initialValues = {
    currentPassword: '',
    password: '',
};

const ChangePasswordDialog = ({ open, onClose, onSuccess }) => {
    const { changePassword } = useUserService();
    const user = getUserFromCookies();
    const userId = user?.data?.id;

    const handleSubmit = async (values, { setSubmitting }) => {
        const changePasswordDto = {
            currentPassword: values.currentPassword,
            password: values.password,
        };

        try {
            await changePassword(userId, changePasswordDto);
            onSuccess?.();
            onClose();
        } catch (error) {
            // Error handled in service
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={ChangePasswordSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                        <Form>
                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        type="password"
                                        label="Current Password"
                                        name="currentPassword"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.currentPassword}
                                        error={touched.currentPassword && !!errors.currentPassword}
                                        helperText={touched.currentPassword && errors.currentPassword}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        type="password"
                                        label="New Password"
                                        name="password"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        error={touched.password && !!errors.password}
                                        helperText={touched.password && errors.password}
                                    />
                                </Grid>
                            </Grid>

                            <DialogActions sx={{ mt: 2 }}>
                                <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Save'}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordDialog;
