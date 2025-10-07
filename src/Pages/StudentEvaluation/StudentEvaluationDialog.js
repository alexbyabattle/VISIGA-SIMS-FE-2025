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

// ✅ Validation schema for Student Evaluation Dialog
const CreateEvaluationSchema = yup.object().shape({
  studentId: yup.string().required("Student is required"),
  termId: yup.string().required("Term is required"),
  spiritualLife: yup.string().oneOf(['A', 'B', 'F'], "Please select A, B, or F"), // Made optional
  academicLife: yup.string().oneOf(['A', 'B', 'F'], "Please select A, B, or F"), // Made optional
  manualWork: yup.string().oneOf(['A', 'B', 'F'], "Please select A, B, or F"), // Made optional
  health: yup.string().oneOf(['A', 'B', 'F'], "Please select A, B, or F"), // Made optional
  leadershipSkills: yup.string().oneOf(['A', 'B', 'F'], "Please select A, B, or F"), // Made optional
  sports: yup.string().oneOf(['A', 'B', 'F'], "Please select A, B, or F"), // Made optional
});

const getInitialValues = (selectedStudent, existingData = null, terms = []) => ({
  studentId: selectedStudent?.id || "",
  termId: existingData?.termId || (terms && terms.length > 0 ? (terms.find(term => term.status === 'ACTIVE')?.id || terms[0]?.id || "") : ""),
  spiritualLife: existingData?.spiritualLife || "",
  academicLife: existingData?.academicLife || "",
  manualWork: existingData?.manualWork || "",
  health: existingData?.health || "",
  leadershipSkills: existingData?.leadershipSkills || "",
  sports: existingData?.sports || "",
});

const StudentEvaluationDialog = ({ open, onClose, onSuccess, students, terms, selectedStudent }) => {
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
      // Only include non-empty values
      const dto = {};
      
      if (values.spiritualLife) dto.spiritualLife = values.spiritualLife;
      if (values.academicLife) dto.academicLife = values.academicLife;
      if (values.manualWork) dto.manualWork = values.manualWork;
      if (values.health) dto.health = values.health;
      if (values.leadershipSkills) dto.leadershipSkills = values.leadershipSkills;
      if (values.sports) dto.sports = values.sports;

      // Use partial update to only update secretary fields (grades)
      await updatePartialEvaluationByTermStudent(values.termId, values.studentId, dto, () => {
        toast.success("Student evaluation saved successfully");
        onSuccess?.();
        onClose();
      });
    } catch (error) {
      toast.error("Failed to save student evaluation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>STUDENT EVALUATION - SECRETARY</DialogTitle>
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

                {/* Grade Fields */}
                {[
                  { field: "spiritualLife", label: "Spiritual Life" },
                  { field: "academicLife", label: "Academic Life" },
                  { field: "manualWork", label: "Manual Work" },
                  { field: "health", label: "Health" },
                  { field: "leadershipSkills", label: "Leadership Skills" },
                  { field: "sports", label: "Sports" },
                ].map(({ field, label }) => (
                  <Grid item xs={12} lg={6} key={field}>
                    <Field
                      as={TextField}
                      select
                      fullWidth
                      label={label}
                      name={field}
                      variant="filled"
                      value={values[field]}
                      error={touched[field] && !!errors[field]}
                      helperText={touched[field] && errors[field]}
                    >
                      <MenuItem value="A">A</MenuItem>
                      <MenuItem value="B">B</MenuItem>
                      <MenuItem value="F">F</MenuItem>
                    </Field>
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

export default StudentEvaluationDialog;
