import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Button
} from "@mui/material";
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";

// Sample teacher list (random names)
const teachers = [
  "Mr. John Bosco",
  "Ms. Maria Theresa",
  "Mr. Peter Andrew",
  "Ms. Agnes Lucy",
  "Mr. Joseph Michael",
  "Ms. Catherine Rose",
  "Mr. Anthony Gabriel",
  "Ms. Elizabeth Grace",
];

// Helper: get Monday of a given week in a year
const getDateOfISOWeek = (week, year) => {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay();
  const ISOweekStart = simple;
  if (dayOfWeek <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return ISOweekStart;
};

// Helper: format date as "DD MMM"
const formatDate = (date) => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

// Generate duty roster for the whole year
const generateDutyRoster = (teacherList, year) => {
  const roster = [];
  const totalWeeks = 52; // standard year
  for (let week = 1; week <= totalWeeks; week++) {
    const startDate = getDateOfISOWeek(week, year);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const teacher = teacherList[(week - 1) % teacherList.length]; // rotate teachers
    roster.push({
      week,
      teacher,
      start: formatDate(startDate),
      end: formatDate(endDate),
    });
  }
  return roster;
};

const TeacherDutyRoster = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const year = new Date().getFullYear();
  const roster = generateDutyRoster(teachers, year);

  // Get current week number
  const currentDate = new Date();
  const firstJan = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor(
    (currentDate - firstJan) / (24 * 60 * 60 * 1000)
  );
  const currentWeek = Math.ceil((days + firstJan.getDay() + 1) / 7);

  const currentDuty = roster.find((r) => r.week === currentWeek);

  return (
    <Box sx={{ m: 2 }}>
      {/* Page Title */}
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 3, fontWeight: "bold", color: colors.greenAccent[500] }}
      >
        Teacher Duty Roster ({year})
      </Typography>

      {/* Current Week Supervisor */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: colors.primary[400],
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          This Week is Supervised by:
        </Typography>
        <Typography variant="h5" color="secondary" fontWeight="bold">
          {currentDuty ? currentDuty.teacher : "N/A"}
        </Typography>
        <Typography variant="body1">
          ({currentDuty?.start} - {currentDuty?.end})
        </Typography>
      </Paper>

      {/* Full Roster */}
      <Typography
        variant="h6"
        sx={{ mb: 1, fontWeight: "bold", color: colors.grey[100] }}
      >
        Full Year Schedule:
      </Typography>

      <Paper>
        <List>
          {roster.map((duty, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: "1px solid #ccc",
              }}
            >
              <ListItemText
                primary={`Week ${duty.week} (${duty.start} - ${duty.end}): ${duty.teacher}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TeacherDutyRoster;  