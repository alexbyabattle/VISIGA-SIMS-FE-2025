import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import useStudentEvaluationService from "../../api/services/StudentEvaluationService";
import * as yup from "yup";

// ✅ Validation schema for Rector Message Dialog
const CreateEvaluationSchema = yup.object().shape({
  studentId: yup.string().required("Student is required"),
  termId: yup.string().required("Term is required"),
  rectorComments: yup.string().max(500), // Made optional
  dateOfOpening: yup.date(), // Made optional
});

const getInitialValues = (selectedStudent, existingData = null, terms = []) => ({
  studentId: selectedStudent?.id || "",
  termId: existingData?.termId || (terms.find(term => term.status === 'ACTIVE')?.id || terms[0]?.id || ""),
  rectorComments: existingData?.rectorComments || "",
  dateOfOpening: existingData?.dateOfOpening ? dayjs(existingData.dateOfOpening) : dayjs(),
});

const RectorCommentsDialog = ({ open, onClose, onSuccess, students, terms, selectedStudent }) => {
  const { createEvaluation, getEvaluationByTermStudent, updatePartialEvaluationByTermStudent } = useStudentEvaluationService();
  const [existingData, setExistingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing data when dialog opens
  useEffect(() => {
    const loadExistingData = async () => {
      if (open && selectedStudent && terms.length > 0) {
        setIsLoading(true);
        try {
          // Try to get existing evaluation for the first active term
          const activeTerm = terms.find(term => term.status === 'ACTIVE') || terms[0];
          if (activeTerm) {
            const data = await getEvaluationByTermStudent(activeTerm.id, selectedStudent.id);
            setExistingData(data);
          }
        } catch (error) {
          // No existing data found, that's okay
          setExistingData(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExistingData();
  }, [open, selectedStudent?.id, terms.length]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Only include non-empty values
      const dto = {};
      
      if (values.rectorComments) dto.rectorComments = values.rectorComments;
      if (values.dateOfOpening) dto.dateOfOpening = values.dateOfOpening.format("YYYY-MM-DD HH:mm:ss");

      // Use partial update to only update rector fields
      await updatePartialEvaluationByTermStudent(values.termId, values.studentId, dto, () => {
        toast.success("Rector's message saved successfully");
        onSuccess?.();
        onClose();
      });
    } catch (error) {
      toast.error("Failed to save rector's message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>RECTOR'S MESSAGE</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={getInitialValues(selectedStudent, existingData, terms)}
          validationSchema={CreateEvaluationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
              <Grid container spacing={2} mt={1}>
                {/* Student dropdown */}
                <Grid item xs={12} lg={6}>
                  <Field
                    as={TextField}
                    select
                    name="studentId"
                    label="Student"
                    fullWidth
                    variant="filled"
                    value={values.studentId}
                    error={touched.studentId && !!errors.studentId}
                    helperText={touched.studentId && errors.studentId}
                  >
                    {students.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.studentName}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                {/* Term dropdown */}
                <Grid item xs={12} lg={6}>
                  <Field
                    as={TextField}
                    select
                    name="termId"
                    label="Term"
                    fullWidth
                    variant="filled"
                    value={values.termId || (terms.find(term => term.status === 'ACTIVE')?.id || terms[0]?.id || "")}
                    error={touched.termId && !!errors.termId}
                    helperText={touched.termId && errors.termId}
                    onChange={(e) => {
                      setFieldValue("termId", e.target.value);
                    }}
                  >
                    {terms.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.termName}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                {/* Rector comments */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    multiline
                    rows={4}
                    label="Rector Comments"
                    name="rectorComments"
                    variant="filled"
                    value={values.rectorComments}
                    error={touched.rectorComments && !!errors.rectorComments}
                    helperText={touched.rectorComments && errors.rectorComments}
                    placeholder="Enter rector's comments about the student..."
                  />
                </Grid>

                {/* Date of Opening */}
                <Grid item xs={12} lg={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date of Opening"
                      value={values.dateOfOpening}
                      onChange={(newValue) =>
                        setFieldValue("dateOfOpening", newValue)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "filled",
                          error: touched.dateOfOpening && !!errors.dateOfOpening,
                          helperText: touched.dateOfOpening && errors.dateOfOpening,
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>

              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default RectorCommentsDialog;
