import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Avatar, Button } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate } from "react-router-dom";
import useParentService from '../../api/services/ParentsService';
import * as image from '../../assets';
import LoadingSpinner from '../../components/LoadingSpinner';
import AssignmentDialog from './ParentsAssignmentDialog';
import UnAssignmentDialog from './ParentsUnAssignmentDialog';
import DetailsBox from '../../components/DetailsBox';
import { getUserFromCookies } from '../../utils/Cookie-utils';

const ParentViewStudentResults = () => {
  const user = getUserFromCookies();
  const id = user?.data?.id;
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [parentDetails, setParentDetails] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isUnAssignmentDialogOpen, setIsUnAssignmentDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { loadParentDetails, getAssignedStudents } = useParentService();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          setLoading(true);
          const parentData = await loadParentDetails(id);
          const studentData = await getAssignedStudents(id);
          setParentDetails(parentData);
          setAssignedStudents(studentData || []);
        } catch (error) {
          console.error("Error fetching parent/student data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  const openExamsResultsPage = (studentId, classId) => {
    navigate(`/exams_details/${classId}/${studentId}`);
  };

  const openTermResultsPage = (studentId, classId) => {
    navigate(`/term_results_page/${classId}/${studentId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading parent and student data..." height="60vh" />;
  }

  return (
    <Box sx={{ ml: '20px', mr: '20px' }}>
      {/* Dialogs */}
      <AssignmentDialog
        parentId={id}
        open={isAssignmentDialogOpen}
        onClose={() => setIsAssignmentDialogOpen(false)}
        onSuccess={() => getAssignedStudents(id).then(setAssignedStudents).catch(console.error)}
      />
      <UnAssignmentDialog
        parentId={id}
        open={isUnAssignmentDialogOpen}
        onClose={() => setIsUnAssignmentDialogOpen(false)}
        onSuccess={() => getAssignedStudents(id).then(setAssignedStudents).catch(console.error)}
      />

      {/* Header */}
      <Box
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
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '0.8rem', sm: '1rem', md: '1.4rem' } }}
            >
              St Mary&apos;s Junior Seminary (VISIGA SEMINARY)
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
            sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' } }}
          >
            RESULTS OF THE SEMINARIANS
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          p={1}
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
              sx={{ fontSize: { xs: '0.8rem', sm: '1rem', md: '1.4rem' } }}
            >
              Seminary under Archdiocese of Dar es Salaam
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Profile */}
      <Box
        display="flex"
        alignItems="center"
        mb={2}
        flexDirection={{ xs: 'column', sm: 'row' }}
        textAlign={{ xs: 'center', sm: 'left' }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block', mb: { xs: 2, sm: 0 } }}>
          <Avatar
            alt={parentDetails?.name || 'Parent Picture'}
            src={
              parentDetails?.photoUrl
                ? `${process.env.REACT_APP_API_URL || 'http://localhost:8086'}${parentDetails.photoUrl}`
                : image.defaultProfile
            }
            sx={{
              width: { xs: 80, sm: 100, md: 120 },
              height: { xs: 80, sm: 100, md: 120 },
              border: parentDetails?.photoUrl ? '2px solid #ccc' : '2px solid red'
            }}
          />
        </Box>
        <Box ml={{ xs: 0, sm: 3 }} mb={3}>
          <Typography><strong>Parent Name:</strong> {parentDetails?.name || 'N/A'}</Typography>
          <Typography><strong>Email:</strong> {parentDetails?.email || 'N/A'}</Typography>
          <Typography><strong>Phone:</strong> {parentDetails?.phoneNumber || 'N/A'}</Typography>
          <Typography><strong>Status:</strong> {parentDetails?.status || 'N/A'}</Typography>
          <Typography><strong>Created At:</strong> {parentDetails?.createdAt ? new Date(parentDetails.createdAt).toLocaleDateString() : 'N/A'}</Typography>
        </Box>
      </Box>

      {/* Students */}
      <Typography
        variant="h4"
        align="start"
        sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }, mb: 2 }}
      >
        VIEW RESULTS OF
      </Typography>

      {/* ✅ Responsive Grid */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        }}
        gap={3}
      >
        {assignedStudents.map((item, index) => {
          const student = item?.student;
          if (!student) return null;

          return (
            <Box
              key={index}
              sx={{
                backgroundColor: colors.primary[400],
                borderRadius: '8px',
                padding: '16px',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 2,
                overflow: 'hidden',
              }}
            >
              {/* Student Info with Labels */}
              <Typography variant="subtitle2"><strong>Student Name:</strong> {student.name || 'N/A'}</Typography>
              <Typography variant="subtitle2"><strong>Class:</strong> {student.className || 'N/A'}</Typography>
              <Typography variant="subtitle2"><strong>Parish:</strong> {student.parishName || 'N/A'}</Typography>
              <Typography variant="subtitle2"><strong>Archdiocese:</strong> {student.archdiocese || 'N/A'}</Typography>
              <Typography variant="subtitle2"><strong>Status:</strong> {student.status || 'N/A'}</Typography>
              <Typography variant="subtitle2"><strong>Created At:</strong> {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}</Typography>

              {/* Buttons */}
              <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap" mt={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => openExamsResultsPage(student.id, student.classId)}
                >
                  Results
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => openTermResultsPage(student.id, student.classId)}
                >
                  Report
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ParentViewStudentResults;
