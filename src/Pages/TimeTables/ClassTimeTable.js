import React, { useState, useEffect } from 'react';
import { 
  Box, 
  useTheme, 
  Typography, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";

// Subjects list
const subjects = [
  "Chemistry",
  "Physics",
  "Mathematics",
  "Biology",
  "Civics",
  "Geography",
  "History",
  "English",
  "Kiswahili",
  "Bible Knowledge",
];

// Helper to format time as "HH:MM"
const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Generate timetable sessions for one day
const generateDayTimetable = (startIndex = 0) => {
  const start = new Date();
  start.setHours(8, 0, 0, 0); // start 08:00
  const end = new Date();
  end.setHours(14, 0, 0, 0); // end 14:00
  const teaStart = new Date();
  teaStart.setHours(9, 20, 0, 0);
  const teaEnd = new Date();
  teaEnd.setHours(10, 0, 0, 0);

  const sessions = [];
  let current = new Date(start);
  let subjectIndex = startIndex;

  while (current < end) {
    let next = new Date(current);
    next.setMinutes(current.getMinutes() + 40);

    // Handle tea break
    if (current >= teaStart && current < teaEnd) {
      sessions.push({
        time: `${formatTime(teaStart)} - ${formatTime(teaEnd)}`,
        subject: "Tea Break",
      });
      current = new Date(teaEnd);
      continue;
    }

    // Avoid sessions that overlap with tea break
    if (next > teaStart && next <= teaEnd) {
      next = new Date(teaStart);
    }

    if (next <= end) {
      // Assign subject in rotation
      const subject = subjects[subjectIndex % subjects.length];
      sessions.push({
        time: `${formatTime(current)} - ${formatTime(next)}`,
        subject,
      });
      subjectIndex++;
    }

    current = new Date(next);
  }

  return { sessions, nextIndex: subjectIndex };
};

const ClassTimetable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let subjectIndex = 0;

  // Generate timetable for all weekdays
  const weeklyTimetable = days.map((day) => {
    const { sessions, nextIndex } = generateDayTimetable(subjectIndex);
    subjectIndex = nextIndex;
    return { day, sessions };
  });

  // Extract the "time slots" (same for all days since generated sequentially)
  const timeSlots = weeklyTimetable[0].sessions.map((s) => s.time);

  return (
    <Box sx={{ m: 2 }}>
      {/* Header */}
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: "bold", color: colors.greenAccent[500] }}
      >
        Weekly Class Timetable
      </Typography>

      {/* Single table for all days */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: colors.primary[400] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
              {days.map((day, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((time, rowIndex) => (
              <TableRow key={rowIndex}>
                {/* Time column */}
                <TableCell>{time}</TableCell>
                {/* Subjects for each day at this time */}
                {weeklyTimetable.map((dayData, colIndex) => (
                  <TableCell key={colIndex}>
                    {dayData.sessions[rowIndex]
                      ? dayData.sessions[rowIndex].subject
                      : ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClassTimetable;
