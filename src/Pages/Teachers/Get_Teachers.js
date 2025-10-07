import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Avatar, Button } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate, useParams } from "react-router-dom";
import useTeacherService from '../../api/services/teacherService';
import useUserService from '../../api/services/userService';
import * as image from '../../assets';
import LoadingSpinner from '../../components/LoadingSpinner';
import DetailsBox from '../../components/DetailsBox';
import { getUserFromCookies } from '../../utils/Cookie-utils';


const Teacher_Data = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Spinner loading state
  const user = getUserFromCookies();
  const role = user?.data?.role;

  const {
    loadTeacherSubjects,
  } = useTeacherService();

  const {
    loadUserDetails,
  } = useUserService();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const teacherData = await loadUserDetails(id);
          const teacherSubjectsData = await loadTeacherSubjects(id);
          setTeacherDetails(teacherData);
          setTeacherSubjects(teacherSubjectsData || []);
        } catch (error) {
          // Handle error silently or show user-friendly message
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  const openClassExamsPage = (subjectId, teacherId, clazzId) => {
    navigate(`/class_exams/${subjectId}/${teacherId}/${clazzId}`);
  };

  
  if (isLoading) {
    return <LoadingSpinner message="Loading teacher data..." height="60vh" />;
  }

  return (
    <Box sx={{ ml: '20px', mr: '20px' }}>
      {/* Header Section */}
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
            SUBJECTS AND CLASSES ASSIGNED TO A TEACHER
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

      {/* Profile Section */}
      <Box 
        display="flex" 
        alignItems="center" 
        mb={2}
        flexDirection={{ xs: 'column', sm: 'row' }}
        textAlign={{ xs: 'center', sm: 'left' }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block', mb: { xs: 2, sm: 0 } }}>
          <Avatar 
            alt="profile" 
            src={teacherDetails?.photoUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:8086'}${teacherDetails.photoUrl}` : null} 
            sx={{ 
              width: { xs: 80, sm: 100, md: 120 }, 
              height: { xs: 80, sm: 100, md: 120 },
              border: teacherDetails?.photoUrl ? '2px solid #ccc' : '2px solid red'
            }} 
          />
        </Box>
        <Box ml={{ xs: 0, sm: 3 }} mb={3}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              mb: { xs: 0.5, sm: 0 }
            }}
          >
            <strong>Name:</strong> {teacherDetails?.name || 'N/A'}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              mb: { xs: 0.5, sm: 0 }
            }}
          >
            <strong>Email:</strong> {teacherDetails?.email || 'N/A'}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            <strong>Phone:</strong> {teacherDetails?.phoneNumber || 'N/A'}
          </Typography>
        </Box>
      </Box>

      {/* Subjects Section */}
      <Box>
        <Typography 
          variant="h4" 
          align="start"
          sx={{ 
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
            mb: 2
          }}
        >
          VIEW SUBJECTS ASSIGNED
        </Typography>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gridAutoRows={{ xs: 'auto', sm: '140px' }}
        gap={{ xs: '10px', sm: '20px' }}
      >
        {teacherSubjects
          .filter(entry => role === 'ADMIN' || entry.clazz?.status === 'ONGOING')
          .map((entry, index) => (
            <Box
              key={index}
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <DetailsBox
                name1="CLASS"
                clazz={entry.clazz?.className || 'N/A'}
                /* class_createdAt={(() => {
                  const clazzName = entry.clazz?.className || '';
                  const match = clazzName.match(/VSG-OLEVEL-(\d{4})-\d{4}/);
                  if (!match) return 'N/A';

                  const startYear = parseInt(match[1], 10);
                  const currentYear = new Date().getFullYear();
                  const formLevel = currentYear - startYear + 1;

                  switch (formLevel) {
                    case 1: return 'Form One';
                    case 2: return 'Form Two';
                    case 3: return 'Form Three';
                    case 4: return 'Form Four';
                    default: return 'GRADUATED';
                  }
                })()} */
                class_createdAt={entry.clazz?.classType || 'N/A'}
                class_status={entry.clazz?.status || 'N/A'}
                name2="SUBJECT"
                subject={entry.subject?.subjectName || 'N/A'}
                subject_createdAt="Examined By NECTA"
                subject_status={entry.subject?.status || 'N/A'}
                icon={
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      openClassExamsPage(entry.subject.id, entry.id, entry.clazz.id)
                    }
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                      padding: { xs: '4px 8px', sm: '6px 16px', md: '8px 16px' },
                      minWidth: { xs: 'auto', sm: 'auto' },
                      whiteSpace: { xs: 'nowrap', sm: 'normal' }
                    }}
                  >
                    <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
                      VIEW & ADD RESULTS
                    </Box>
                    <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>
                      VIEW RESULTS
                    </Box>
                  </Button>
                }
              />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default Teacher_Data;
