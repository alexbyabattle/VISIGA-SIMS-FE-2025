import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  useTheme,
  Button,
  Tooltip,
  Avatar,
  IconButton
} from '@mui/material';
import { PhotoCamera, AddToQueue, DoDisturbOn } from '@mui/icons-material';
import { useParams, useNavigate } from "react-router-dom";
import { tokens } from '../../theme';
import * as image from '../../assets';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useParentService from '../../api/services/ParentsService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import AssignmentDialog from './ParentsAssignmentDialog';
import UnAssignmentDialog from './ParentsUnAssignmentDialog';
import DetailsBox from '../../components/DetailsBox';

const Parents_Data = () => {
  const { id } = useParams();
  const user = getUserFromCookies();
  const role = user?.data?.role;
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [parentDetails, setParentDetails] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isUnAssignmentDialogOpen, setIsUnAssignmentDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  const { loadParentDetails, getAssignedStudents } = useParentService();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true); // ✅ Start loading
        try {
          const parentData = await loadParentDetails(id);
          const studentData = await getAssignedStudents(id);
          setParentDetails(parentData);
          setAssignedStudents(studentData);
        } catch (error) {
          console.error('Error loading parent/student data:', error);
        } finally {
          setLoading(false); // ✅ Stop loading
        }
      }
    };

    fetchData();
  }, [id]);

  const openExamsResultsPage = (studentId, classId) => {
    if (studentId && classId) {
      navigate(`/exams_details/${classId}/${studentId}`);
    } else {
      // console.warn("Missing studentId or classId when trying to navigate.");
    }
  };

  const openTermResultsPage = (studentId, classId) => {
    if (studentId && classId) {
      navigate(`/term_results_page/${classId}/${studentId}`);
    } else {
      // console.warn("Missing studentId or classId when trying to navigate.");
    }
  };



  if (loading) {
    return <LoadingSpinner message="Loading parent and student data..." />;
  }

  return (
    <Box sx={{ mx: 2 }}>
      {/* Dialogs */}
      <AssignmentDialog
        parentId={id}
        open={isAssignmentDialogOpen}
        onClose={() => setIsAssignmentDialogOpen(false)}
        onSuccess={() => getAssignedStudents(id).then(setAssignedStudents)}
      />
      <UnAssignmentDialog
        parentId={id}
        open={isUnAssignmentDialogOpen}
        onClose={() => setIsUnAssignmentDialogOpen(false)}
        onSuccess={() => getAssignedStudents(id).then(setAssignedStudents)}
      />

      {/* Header */}
      <Box
        height="auto"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        border={`1px solid ${borderColor}`}
        mb={2}
        flexWrap="wrap"
      >
        {/* Left Section */}
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          borderRight={{ xs: 'none', md: `1px solid ${borderColor}` }}
          p={1}
          overflow="hidden"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems="center"
            textAlign={{ xs: 'center', md: 'left' }}
          >
            <Box
              component="img"
              src={image.visigalogo}
              alt="logo"
              sx={{
                height: 80,
                width: 80,
                mb: { xs: 1, md: 0 },
                mr: { xs: 0, md: 2 },
              }}
            />
            <Typography
              variant="h7"
              fontWeight="bold"
              sx={{ fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.5rem' } }}
            >
              St Mary's Junior Seminary (VISIGA SEMINARY)
            </Typography>
          </Box>
        </Box>

        {/* Center Section */}
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRight={{ xs: 'none', md: `1px solid ${borderColor}` }}
          p={2}
          textAlign="center"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.4rem' } }}
          >
            RESULTS OF THE SEMINARIANS PAGE
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          p={1}
          overflow="hidden"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems="center"
            textAlign={{ xs: 'center', md: 'left' }}
          >
            <Box
              component="img"
              src={image.cathedral5}
              alt="arch"
              sx={{
                height: 80,
                width: 80,
                mb: { xs: 1, md: 0 },
                mr: { xs: 0, md: 2 },
              }}
            />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.5rem' } }}
            >
              Seminary under Archdiocese of Dar es Salaam
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Profile */}
      <Box display="flex" alignItems="center" mb={3}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            alt="parent"
            src={parentDetails?.photoUrl || image.defaultProfile}
            sx={{ width: 100, height: 100 }}
          />
        </Box>
        <Box ml={3}>
          <Typography><strong>Name:</strong> {parentDetails?.name || 'N/A'}</Typography>
          <Typography><strong>Email:</strong> {parentDetails?.email || 'N/A'}</Typography>
          <Typography><strong>Phone:</strong> {parentDetails?.phoneNumber || 'N/A'}</Typography>
          <Typography><strong>Status:</strong> {parentDetails?.status || 'N/A'}</Typography>
          <Typography><strong>Created At:</strong> {parentDetails?.createdAt ? new Date(parentDetails.createdAt).toLocaleDateString() : 'N/A'}</Typography>
        </Box>
      </Box>

      {role === 'ADMIN' && (
        <Box mb={3}>
          <Tooltip title="Assign Student">
            <IconButton color="success" onClick={() => setIsAssignmentDialogOpen(true)}>
              <AddToQueue sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Unassign Student">
            <IconButton color="error" onClick={() => setIsUnAssignmentDialogOpen(true)}>
              <DoDisturbOn sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Assigned Students */}
      <Typography variant="h5" mb={2}>VIEW ASSIGNED STUDENTS</Typography>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gridAutoRows="auto"
        gap="20px"
      >
        {assignedStudents.map((item, index) => (
          <Box
            key={index}
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <DetailsBox
              name1="STUDENT"
              clazz={item.student?.name || 'N/A'}
              class_createdAt={item.student?.createdAt ? new Date(item.student.createdAt).toLocaleDateString() : 'N/A'}
              class_status={item.student?.status || 'N/A'}
              name2="PARISH"
              subject={item.student?.parishName || 'N/A'}
              subject_createdAt={item.student?.archdiocese || 'N/A'}
              subject_status={item.student?.className || 'N/A'}
              icon={
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => openExamsResultsPage(item.student.id, item.student.classId)}
                    sx={{
                      px: 0.5, 
                      py: 0.5, 
                      minWidth: "auto",
                      textTransform: "none", 
                    }}
                  >
                    RESULTS
                  </Button>


                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => openTermResultsPage(item.student.id, item.student.classId)}
                    sx={{
                      px: 1, 
                      py: 0.5, 
                      minWidth: "auto",
                      textTransform: "none", 
                    }}
                  >
                    REPORT
                  </Button>
                </Box>
              }
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Parents_Data;
