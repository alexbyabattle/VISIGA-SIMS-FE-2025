import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { getUserFromCookies } from '../../utils/Cookie-utils';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const user = getUserFromCookies();
  const role = user?.data?.role;
  const userId = user?.data?.id;

  const openParentsViewResultPage = () => {
    navigate(`/parent_view_results`);
  };

  const openEditSeminariansInformation = () => {
    navigate(`/parent_view_student_details`);
  };

  const openSchoolTimetable = () => {
    navigate(`/schoolTimetable`);
  };

   const openTeachersDutyRoaster = () => {
    navigate(`/teachersDuty`);
  };

  const openClassTimetable = () => {
    navigate(`/classTimetable`);
  };

  const openSubjectsAssignedToTeacherPage = () => {
    if (userId) {
      navigate(`/teacher_details/${userId}`);
    } else {
      console.error("User ID not found in cookies");
    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Mfumo wa matokeo wa visiga seminary(VISIGA SIMS)" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gridAutoRows="140px"
        gap="20px"
      >
        {role === 'PARENT' && (
          <>
            <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title="MATOKEO & RIPOTI"
                subtitle="Tazama matokeo & ripoti ya mwanao"
                progress={
                  <Button variant="contained" color="secondary" onClick={openParentsViewResultPage}>
                    MATOKEO
                  </Button>
                }
                increase="VISIGA-SIMS"
                icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>

            <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title="TAARIFA ZA MSEMINARI"
                subtitle="Tazama & ongezea taarifa muhimu za mseminari "
                progress={
                  <Button variant="contained" color="secondary" onClick={openEditSeminariansInformation}>
                    TAARIFA
                  </Button>
                }
                increase="VISIGA-SIMS"
                icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>

            <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title="RATIBA YA SEMINARI"
                subtitle="Tazama ratiba ya seminari "
                progress={
                  <Button variant="contained" color="secondary" onClick={openSchoolTimetable}>
                    RATIBA
                  </Button>
                }
                increase="VISIGA-SIMS"
                icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>

            <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title=" ADA & MICHANGO"
                subtitle=" Tazama taarifa kuhusu michango na Ada ya seminary"
                progress={
                  <Button variant="contained" color="secondary" >
                    ADA
                  </Button>
                }
                increase="VISIGA-SIMS"
                icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>
          </>
        )}



        {role === "TEACHER" && (
          <>
          
            <Box
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={2}
              borderRadius="4px"
            >
              <StatBox
                title="SUBJECTS ASSIGNED"
                subtitle="View  classes / subjects assigned and fill results"
                progress={
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={openSubjectsAssignedToTeacherPage}
                  >
                    VIEW
                  </Button>
                }
                increase="VISIGA-SIMS"
                icon={
                  <EmailIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>

            <Box
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={2}
              borderRadius="4px"
            >
              <StatBox
                title="CLASS TIMETABLE"
                subtitle="View class Timetable"
                progress={
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={openClassTimetable}
                  >
                    VIEW
                  </Button>
                }
                increase="VISIGA-SIMS"
                icon={
                  <EmailIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>


            <Box
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={2}
              borderRadius="4px"
            >
              <StatBox
                title="TEACHERS DUTY"
                subtitle="View teachers duties"
                progress={
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={openTeachersDutyRoaster}
                  >
                    VIEW
                  </Button>
                }
                increase="VISIGA-SIMS"
                icon={
                  <EmailIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>



            <Box
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={2}
              borderRadius="4px"
            >
              <StatBox
                title="SCHOOL TIMETABLE"
                subtitle="View School Timetable"
                progress={
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={openSchoolTimetable}
                  >
                    VIEW
                  </Button>
                }
                increase="VISIGA-SIMS"
                icon={
                  <EmailIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
          </>
        )}



        {role === 'ADMIN' && (
          <>

            <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title=" VISIGA SEMINARY"
                subtitle="View Results"
                progress="1"
                increase="24hrs"
                icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>
            <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title="VISIGA SEMINARY"
                subtitle="View Seminarian Progress"
                progress="1"
                increase="24hrs"
                icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>

            <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title="VISIGA SEMINARY"
                subtitle="View Seminarian Progress"
                progress="1"
                increase="24hrs"
                icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>

            <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title="VISIGA SEMINARY"
                subtitle="View Seminarian Progress"
                progress="1"
                increase="24hrs"
                icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>




          </>
        )}



      </Box>
    </Box>
  );
};

export default Dashboard;
