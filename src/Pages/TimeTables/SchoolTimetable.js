import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme"; // your theme

// Sample timetable data (you can fetch this later if needed)
const timetable = [
  { time: "5:00 – 5:10 am", event: "Raising up and tidying up" },
  { time: "5:45 – 6:10 am", event: "Lauds/Morning Prayers, Meditation & Angelus" },
  { time: "6:15 – 6:45 am", event: "Holy Mass" },
  { time: "6:45 – 7:25 am", event: "Morning Activities" },
  { time: "7:25 – 7:45 am", event: "Morning Assembly/English Program" },
  { time: "7:45 – 9:15 am", event: "First two periods" },
  { time: "9:15 – 9:45 am", event: "Breakfast" },
  { time: "9:45 – 12:15 pm", event: "Third, Fourth, Fifth Periods" },
  { time: "12:15 – 12:45 pm", event: "Mid-Day Prayers" },
  { time: "12:45 – 2:15 pm", event: "Lunch/Rest" },
  { time: "2:15 – 2:45 pm", event: "Personal time / Group prayers" },
  { time: "2:45 – 3:45 pm", event: "Manual Work" },
  { time: "3:45 – 4:00 pm", event: "Washing up (Personal Cleanliness)" },
  { time: "4:00 – 6:00 pm", event: "Personal Study / Group discussion" },
  { time: "6:00 – 6:30 pm", event: "Evening Prayers, Small Christian Communities" },
  { time: "6:30 – 7:00 pm", event: "Supper" },
  { time: "7:00 – 7:30 pm", event: "Recreation / Games" },
  { time: "7:30 – 8:00 pm", event: "Spiritual Reading, Rosary, Meditation, Angelus" },
  { time: "8:00 – 8:30 pm", event: "Evening Assembly" },
  { time: "8:30 – 9:45 pm", event: "Personal Study / Group discussion" },
  { time: "9:45 – 10:00 pm", event: "Vespers / Evening Prayers" },
  { time: "10:00 – 10:30 pm", event: "Lights Out" },
];

const SchoolTimetable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ m: 2 }}>
      {/* Header */}
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 3, fontWeight: "bold", color: colors.greenAccent[500] }}
      >
        St. Mary’s Junior Seminary (Visiga) - Daily Timetable
      </Typography>

      {/* Responsive Table */}
      <TableContainer component={Paper}>
        <Table aria-label="timetable">
          <TableHead sx={{ backgroundColor: colors.primary[400] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Time
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Event
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timetable.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
                >
                  {row.time}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                  {row.event}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SchoolTimetable;
