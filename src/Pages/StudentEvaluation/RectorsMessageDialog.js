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
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatListBulleted,
  FormatListNumbered,
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import useStudentEvaluationService from "../../api/services/StudentEvaluationService";
import * as yup from "yup";

// Custom Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder, maxLength = 10000000 }) => {
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    align: 'left',
    list: 'none'
  });

  const handleFormatChange = (format, value) => {
    setFormats(prev => ({ ...prev, [format]: value }));
    
    // Apply formatting to selected text
    const textarea = document.getElementById('rich-text-area');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      
      if (selectedText) {
        let formattedText = selectedText;
        
        if (format === 'bold') {
          formattedText = value ? `<b>${selectedText}</b>` : selectedText.replace(/<\/?b>/g, '');
        } else if (format === 'italic') {
          formattedText = value ? `<i>${selectedText}</i>` : selectedText.replace(/<\/?i>/g, '');
        } else if (format === 'underline') {
          formattedText = value ? `<u>${selectedText}</u>` : selectedText.replace(/<\/?u>/g, '');
        } else if (format === 'strikethrough') {
          formattedText = value ? `<s>${selectedText}</s>` : selectedText.replace(/<\/?s>/g, '');
        }
        
        const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        onChange(newValue);
      }
    }
  };

  const handleListFormat = (listType) => {
    const textarea = document.getElementById('rich-text-area');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      
      if (selectedText) {
        let formattedText = selectedText;
        const lines = selectedText.split('\n');
        
        if (listType === 'bullet') {
          formattedText = lines.map(line => line.trim() ? `• ${line}` : line).join('\n');
        } else if (listType === 'number') {
          formattedText = lines.map((line, index) => line.trim() ? `${index + 1}. ${line}` : line).join('\n');
        }
        
        const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        onChange(newValue);
      }
    }
  };

  return (
    <Box>
      {/* Toolbar */}
      <Paper elevation={1} sx={{ p: 1, mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <ToggleButtonGroup size="small" value={formats.bold} exclusive onChange={(e, value) => handleFormatChange('bold', value)}>
          <ToggleButton value={true}>
            <Tooltip title="Bold">
              <FormatBold />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
        
        <ToggleButtonGroup size="small" value={formats.italic} exclusive onChange={(e, value) => handleFormatChange('italic', value)}>
          <ToggleButton value={true}>
            <Tooltip title="Italic">
              <FormatItalic />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
        
        <ToggleButtonGroup size="small" value={formats.underline} exclusive onChange={(e, value) => handleFormatChange('underline', value)}>
          <ToggleButton value={true}>
            <Tooltip title="Underline">
              <FormatUnderlined />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
        
        <ToggleButtonGroup size="small" value={formats.strikethrough} exclusive onChange={(e, value) => handleFormatChange('strikethrough', value)}>
          <ToggleButton value={true}>
            <Tooltip title="Strikethrough">
              <FormatStrikethrough />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Box sx={{ borderLeft: '1px solid #ccc', height: '24px', mx: 1 }} />
        
        <ToggleButtonGroup size="small" value={formats.align} exclusive onChange={(e, value) => setFormats(prev => ({ ...prev, align: value }))}>
          <ToggleButton value="left">
            <Tooltip title="Align Left">
              <FormatAlignLeft />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="center">
            <Tooltip title="Align Center">
              <FormatAlignCenter />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="right">
            <Tooltip title="Align Right">
              <FormatAlignRight />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Box sx={{ borderLeft: '1px solid #ccc', height: '24px', mx: 1 }} />
        
        <IconButton size="small" onClick={() => handleListFormat('bullet')}>
          <Tooltip title="Bullet List">
            <FormatListBulleted />
          </Tooltip>
        </IconButton>
        
        <IconButton size="small" onClick={() => handleListFormat('number')}>
          <Tooltip title="Numbered List">
            <FormatListNumbered />
          </Tooltip>
        </IconButton>
      </Paper>
      
      {/* Text Area */}
      <TextField
        id="rich-text-area"
        fullWidth
        multiline
        rows={8}
        value={value}
        onChange={(e) => {
          const inputValue = e.target.value;
          // Strip HTML tags to count actual text content
          const textContent = inputValue.replace(/<[^>]*>/g, '');
          if (textContent.length <= maxLength) {
            onChange(inputValue);
          } else {
            toast.warning("Text content exceeds character limit");
          }
        }}
        placeholder={placeholder}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
          }
        }}
      />
    </Box>
  );
};

// ✅ Validation schema for Rector Message Dialog
const CreateEvaluationSchema = yup.object().shape({
  studentId: yup.string().required("Student is required"),
  termId: yup.string().required("Term is required"),
  rectorComments: yup.string().test(
    'max-length',
    'Rector comments must be 10,000,000 characters or less',
    function(value) {
      if (!value) return true; // Allow empty values
      // Strip HTML tags to count actual text content
      const textContent = value.replace(/<[^>]*>/g, '');
      return textContent.length <= 10000000;
    }
  ),
  dateOfOpening: yup.date(), // Made optional
});

const getInitialValues = (selectedStudent, existingData = null, terms = []) => ({
  studentId: selectedStudent?.id || "",
  termId: existingData?.termId || (terms && terms.length > 0 ? (terms.find(term => term.status === 'ACTIVE')?.id || terms[0]?.id || "") : ""),
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
      
      if (values.rectorComments) {
        console.log("Rector comments length:", values.rectorComments.length);
        dto.rectorComments = values.rectorComments;
      }
      if (values.dateOfOpening) dto.dateOfOpening = values.dateOfOpening.format("YYYY-MM-DD HH:mm:ss");

      // Use partial update to only update rector fields
      await updatePartialEvaluationByTermStudent(values.termId, values.studentId, dto, () => {
        toast.success("Rector's message saved successfully");
        onSuccess?.();
        onClose();
      });
    } catch (error) {
      console.error("Error saving rector's message:", error);
      console.error("Full error details:", error);
      if (error.message && error.message.includes("Data truncation")) {
        toast.error("Database column size issue. Please run the database migration: ALTER TABLE student_evaluation MODIFY COLUMN `rector-comments` LONGTEXT;");
      } else {
        toast.error("Failed to save rector's message: " + (error.message || "Unknown error"));
      }
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

                {/* Rector comments */}
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Rector Comments
                    </Typography>
                    <RichTextEditor
                      value={values.rectorComments || ''}
                      onChange={(content) => setFieldValue("rectorComments", content)}
                      placeholder="Enter rector's comments about the student... (Max 10,000,000 characters)"
                      maxLength={10000000}
                    />
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="caption" 
                        color={touched.rectorComments && errors.rectorComments ? 'error' : 'text.secondary'}
                      >
                        {touched.rectorComments && errors.rectorComments 
                          ? errors.rectorComments 
                          : (() => {
                              const textContent = (values.rectorComments || '').replace(/<[^>]*>/g, '');
                              const length = textContent.length;
                              const remaining = 10000000 - length;
                              if (remaining < 100000) {
                                return `⚠️ ${length.toLocaleString()}/10,000,000 characters (${remaining.toLocaleString()} remaining)`;
                              }
                              return `${length.toLocaleString()}/10,000,000 characters`;
                            })()
                        }
                      </Typography>
                    </Box>
                  </Box>
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
