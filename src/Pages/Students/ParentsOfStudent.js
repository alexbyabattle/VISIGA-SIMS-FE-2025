import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Avatar,
  Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useStudentService from '../../api/services/studentService';
import DetailsBox from '../../components/DetailsBox';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as image from '../../assets';

const ParentsOfStudent = () => {
  const { studentId } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);

  const [studentDetails, setStudentDetails] = useState(null);
  const [assignedParents, setAssignedParents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { loadStudentDetails, loadStudentParentsDetails } = useStudentService();

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        const studentData = await loadStudentDetails(studentId);
        const parentData = await loadStudentParentsDetails(studentId);

        setStudentDetails(studentData);
        setAssignedParents(Array.isArray(parentData) ? parentData : []);
      } catch (error) {
        console.error('Error loading parent/student data:', error);
        setAssignedParents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) {
    return <LoadingSpinner message="Loading parent and student data..." />;
  }

  return (
    <Box sx={{ mx: 2 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        border={`1px solid ${borderColor}`}
        mb={2}
        flexWrap="wrap"
      >
        {/* Left */}
        <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={1}>
          <Box display="flex" alignItems="center" flexDirection={{ xs: 'column', md: 'row' }}>
            <Box
              component="img"
              src={image.visigalogo}
              alt="logo"
              sx={{ height: 80, width: 80, mb: { xs: 1, md: 0 }, mr: { xs: 0, md: 2 } }}
            />
            <Typography variant="h7" fontWeight="bold" sx={{ fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.5rem' } }}>
              St Mary's Junior Seminary (VISIGA SEMINARY)
            </Typography>
          </Box>
        </Box>

        {/* Center */}
        <Box flex={1} display="flex" justifyContent="center" alignItems="center" p={2} textAlign="center">
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.4rem' } }}>
              STUDENT'S PARENTS
          </Typography>
        </Box>

        {/* Right */}
        <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={1}>
          <Box display="flex" alignItems="center" flexDirection={{ xs: 'column', md: 'row' }}>
            <Box
              component="img"
              src={image.cathedral5}
              alt="arch"
              sx={{ height: 80, width: 80, mb: { xs: 1, md: 0 }, mr: { xs: 0, md: 2 } }}
            />
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.5rem' } }}>
              Seminary under Archdiocese of Dar es Salaam
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Student Profile */}
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar
          alt="student"
          src={studentDetails?.photoUrl || image.defaultProfile}
          sx={{ width: 100, height: 100 }}
        />
        <Box ml={3}>
          <Typography><strong>Name:</strong> {studentDetails?.studentName || 'N/A'}</Typography>
          <Typography><strong>Status:</strong> {studentDetails?.status || 'N/A'}</Typography>
          <Typography><strong>Created At:</strong> {studentDetails?.createdAt ? new Date(studentDetails.createdAt).toLocaleDateString() : 'N/A'}</Typography>
        </Box>
      </Box>

      {/* Assigned Parents */}
      <Typography variant="h5" mb={2}>Assigned Parents</Typography>
      {assignedParents.length === 0 ? (
        <Typography>No parents for this student</Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          gap="20px"
        >
          {assignedParents.map((parent, index) => (
            <Box
              key={index}
              backgroundColor={colors.primary[400]}
              display="flex"
              justifyContent="center"
            >
              <DetailsBox
                name1="PARENT"
                clazz={parent.parentName || 'N/A'}
                class_createdAt={parent.createdAt ? new Date(parent.createdAt).toLocaleDateString() : 'N/A'}
                class_status={" "}
                name2="EMAIL"
                subject={parent.email || 'N/A'}
                subject_createdAt=""
                subject_status={parent.phoneNumber || 'N/A'}
                icon={"___________"}

              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ParentsOfStudent;
