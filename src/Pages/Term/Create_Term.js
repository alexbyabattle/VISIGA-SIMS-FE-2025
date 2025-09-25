import React from 'react';
import {
    Button,
    TextField,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik, Form, Field } from 'formik';
import { TermSchema } from '../../schemas/Schemas';
import dayjs from 'dayjs';
import useTermService from '../../api/services/termService';

const initialValues = {
    termName: '',
    createdAt: dayjs(),
};

const CreateDialog = ({ open, onClose, onSuccess }) => {
    const { createTerm } = useTermService();

    const handleSubmit = async (values) => {
        const termDto = {
            termName: values.termName,
            createdAt: values.createdAt,
        };

        await createTerm(termDto, () => {
            onSuccess?.();
            onClose();
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>CREATE TERM</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={TermSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={12} lg={6}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Term Name"
                                        name="termName"
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.termName}
                                        error={touched.termName && !!errors.termName}
                                        helperText={touched.termName && errors.termName}
                                    />
                                </Grid>

                                <Grid item xs={12} lg={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Created At"
                                            value={values.createdAt}
                                            onChange={(newValue) =>
                                                setFieldValue('createdAt', newValue)
                                            }
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
