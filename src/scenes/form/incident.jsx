import React from 'react'
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import dayjs from 'dayjs';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const deviceOptions = [
  { value: "printer", label: "Printer" },
  { value: "scanner", label: "Scanner" },
  { value: "computer", label: "Computer" },
  { value: "laptop", label: "Laptop" },
  { value: "cables", label: "Cables" },
];

const incidentTypeOptions = [
  { value: "software", label: "software" },
  { value: "hardware", label: "hardware" },
  { value: "intarnet", label: "intarnet" },

];

//const tomorrow = dayjs().add(1, 'day');





const checkoutSchema = yup.object().shape({

  incident: yup.string().required("required incident"),
  



});


const initialValues = {

  incident: "",

  incidentType: [],

  devices: [],
  dateTime: dayjs(), // Set to the current date and time

};



export const Incident = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    // console.log(values);
  };

  return (
    <Box m="20px">
      <Header title="Incident report form" subtitle="submit  a  incident occured" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >










              <TextField
                select
                fullWidth
                variant="filled"
                label="Devices"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.devices}
                name="devices"
                error={!!touched.devices && !!errors.devices}
                helperText={touched.devices && errors.devices}

                SelectProps={{
                  multiple: true, // Enable multi-select
                  renderValue: (selected) => selected.join(", "), // Display selected items
                }}
                sx={{ gridColumn: "span 2" }}
              >
                {deviceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>



              <TextField
                select
                fullWidth
                variant="filled"
                label="Incident Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.incidentType}
                name="incidentType"
                error={!!touched.incidentType && !!errors.incidentType}
                helperText={touched.incidentType && errors.incidentType}

                SelectProps={{
                  multiple: true, // Enable multi-select
                  renderValue: (selected) => selected.join(", "), // Display selected items
                }}
                sx={{ gridColumn: "span 2" }}
              >
                {incidentTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>




              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="incident name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.incident}
                name="incident"
                error={!!touched.incident && !!errors.incident}
                helperText={touched.incident && errors.incident}
                sx={{ gridColumn: "span 4" }}
              />




              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem label="incident reported at and on">
                  <DateTimePicker
                    value={values.dateTime} // Set the value from formik values
                    onChange={(newValue) => handleChange({ target: { name: "dateTime", value: newValue } })}
                    disableFuture
                    views={['year', 'month', 'day', 'hours', 'minutes']}
                    sx={{ gridColumn: "span 2" }}
                  />
                </DemoItem>
              </LocalizationProvider>


            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ width: "200px", height: "50px" }} // Adjust the width and height as needed
              >
                submit incident
              </Button>
            </Box>

          </form>
        )}
      </Formik>
    </Box>
  );
}


