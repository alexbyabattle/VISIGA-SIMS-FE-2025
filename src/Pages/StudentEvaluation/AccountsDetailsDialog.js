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
import { toast } from "react-hot-toast";
import useStudentEvaluationService from "../../api/services/StudentEvaluationService";
import * as yup from "yup";

// Helper functions for number formatting
const formatNumberWithCommas = (value) => {
  if (!value) return "";
  // Remove any existing commas and non-numeric characters except decimal point
  const numericValue = value.toString().replace(/[^\d.]/g, "");
  // Add commas for thousands
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseNumberFromFormatted = (formattedValue) => {
  if (!formattedValue) return "";
  // Remove commas and return the numeric value
  return formattedValue.replace(/,/g, "");
};

// ✅ Validation schema for Accounts Details Dialog
const CreateEvaluationSchema = yup.object().shape({
  studentId: yup.string().required("Student is required"),
  termId: yup.string().required("Term is required"),
  debts: yup.string().test('is-valid-amount', 'Please enter a valid amount', function(value) {
    if (!value) return true; // Allow empty values
    const numericValue = parseNumberFromFormatted(value);
    return !isNaN(numericValue) && parseFloat(numericValue) >= 0;
  }),
  firstTermFee: yup.string().test('is-valid-amount', 'Please enter a valid amount', function(value) {
    if (!value) return true; // Allow empty values
    const numericValue = parseNumberFromFormatted(value);
    return !isNaN(numericValue) && parseFloat(numericValue) >= 0;
  }),
  secondTermFee: yup.string().test('is-valid-amount', 'Please enter a valid amount', function(value) {
    if (!value) return true; // Allow empty values
    const numericValue = parseNumberFromFormatted(value);
    return !isNaN(numericValue) && parseFloat(numericValue) >= 0;
  }),
  firstTermExamFee: yup.string().test('is-valid-amount', 'Please enter a valid amount', function(value) {
    if (!value) return true; // Allow empty values
    const numericValue = parseNumberFromFormatted(value);
    return !isNaN(numericValue) && parseFloat(numericValue) >= 0;
  }),
  secondTermExamFee: yup.string().test('is-valid-amount', 'Please enter a valid amount', function(value) {
    if (!value) return true; // Allow empty values
    const numericValue = parseNumberFromFormatted(value);
    return !isNaN(numericValue) && parseFloat(numericValue) >= 0;
  }),
  firstTermOtherContribution: yup.string().test('is-valid-amount', 'Please enter a valid amount', function(value) {
    if (!value) return true; // Allow empty values
    const numericValue = parseNumberFromFormatted(value);
    return !isNaN(numericValue) && parseFloat(numericValue) >= 0;
  }),
  secondTermOtherContribution: yup.string().test('is-valid-amount', 'Please enter a valid amount', function(value) {
    if (!value) return true; // Allow empty values
    const numericValue = parseNumberFromFormatted(value);
    return !isNaN(numericValue) && parseFloat(numericValue) >= 0;
  }),
});

const getInitialValues = (selectedStudent, existingData = null, terms = []) => ({
  studentId: selectedStudent?.id || "",
  termId: existingData?.termId || (terms && terms.length > 0 ? (terms.find(term => term.status === 'ACTIVE')?.id || terms[0]?.id || "") : ""),
  debts: existingData?.debts ? formatNumberWithCommas(existingData.debts) : "",
  firstTermFee: existingData?.firstTermFee ? formatNumberWithCommas(existingData.firstTermFee) : "",
  secondTermFee: existingData?.secondTermFee ? formatNumberWithCommas(existingData.secondTermFee) : "",
  firstTermExamFee: existingData?.firstTermExamFee ? formatNumberWithCommas(existingData.firstTermExamFee) : "",
  secondTermExamFee: existingData?.secondTermExamFee ? formatNumberWithCommas(existingData.secondTermExamFee) : "",
  firstTermOtherContribution: existingData?.firstTermOtherContribution ? formatNumberWithCommas(existingData.firstTermOtherContribution) : "",
  secondTermOtherContribution: existingData?.secondTermOtherContribution ? formatNumberWithCommas(existingData.secondTermOtherContribution) : "",
});

const AccountsDetailsDialog = ({ open, onClose, onSuccess, students, terms, selectedStudent }) => {
  const { createEvaluation, getEvaluationByTermStudent, updatePartialEvaluationByTermStudent } = useStudentEvaluationService();
  const [existingData, setExistingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing data when dialog opens
  useEffect(() => {
    const loadExistingData = async () => {
      if (open && selectedStudent && terms && terms.length > 0) {
        setIsLoading(true);
        try {
          // Try to get existing evaluation for the first active term
          const activeTerm = terms && terms.length > 0 ? (terms.find(term => term.status === 'ACTIVE') || terms[0]) : null;
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
  }, [open, selectedStudent?.id, terms?.length]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Parse formatted numbers back to numeric values for API, only include non-empty values
      const dto = {};
      
      if (values.debts) dto.debts = parseNumberFromFormatted(values.debts);
      if (values.firstTermFee) dto.firstTermFee = parseNumberFromFormatted(values.firstTermFee);
      if (values.secondTermFee) dto.secondTermFee = parseNumberFromFormatted(values.secondTermFee);
      if (values.firstTermExamFee) dto.firstTermExamFee = parseNumberFromFormatted(values.firstTermExamFee);
      if (values.secondTermExamFee) dto.secondTermExamFee = parseNumberFromFormatted(values.secondTermExamFee);
      if (values.firstTermOtherContribution) dto.firstTermOtherContribution = parseNumberFromFormatted(values.firstTermOtherContribution);
      if (values.secondTermOtherContribution) dto.secondTermOtherContribution = parseNumberFromFormatted(values.secondTermOtherContribution);

      // Use partial update to only update financial fields
      await updatePartialEvaluationByTermStudent(values.termId, values.studentId, dto, () => {
        toast.success("Accounts details saved successfully");
        onSuccess?.();
        onClose();
      });
    } catch (error) {
      toast.error("Failed to save accounts details");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ACCOUNTS DETAILS</DialogTitle>
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
                    value={values.termId || (terms && terms.length > 0 ? (terms.find(term => term.status === 'ACTIVE')?.id || terms[0]?.id || "") : "")}
                    error={touched.termId && !!errors.termId}
                    helperText={touched.termId && errors.termId}
                    onChange={(e) => {
                      setFieldValue("termId", e.target.value);
                    }}
                  >
                    {terms && terms.length > 0 ? terms.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.termName}
                      </MenuItem>
                    )) : null}
                  </Field>
                </Grid>

                {/* Financial Fields */}
                {[
                  { field: "debts", label: "Debts" },
                  { field: "firstTermFee", label: "First Term Fee" },
                  { field: "secondTermFee", label: "Second Term Fee" },
                  { field: "firstTermExamFee", label: "First Term Exam Fee" },
                  { field: "secondTermExamFee", label: "Second Term Exam Fee" },
                  { field: "firstTermOtherContribution", label: "First Term Other Contribution" },
                  { field: "secondTermOtherContribution", label: "Second Term Other Contribution" },
                ].map(({ field, label }) => (
                  <Grid item xs={12} lg={6} key={field}>
                    <TextField
                      fullWidth
                      label={label}
                      variant="filled"
                      value={formatNumberWithCommas(values[field])}
                      onChange={(e) => {
                        const formattedValue = formatNumberWithCommas(e.target.value);
                        setFieldValue(field, formattedValue);
                      }}
                      error={touched[field] && !!errors[field]}
                      helperText={touched[field] && errors[field]}
                      placeholder="0"
                    />
                  </Grid>
                ))}
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

export default AccountsDetailsDialog;
