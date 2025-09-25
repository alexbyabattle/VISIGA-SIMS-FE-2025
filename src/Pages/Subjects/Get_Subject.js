import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Grid, Card, CardContent, Avatar } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate, useParams } from "react-router-dom";
import useSubjectService from '../../api/services/SubjectService';
import * as image from '../../assets';
import LoadingSpinner from '../../components/LoadingSpinner';
import Header from "../../components/Header";
import DetailsBox from '../../components/DetailsBox';

const Subject_Data = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [loading, setLoading] = useState(false); 

  const { loadClassAndTeacherDetails } = useSubjectService();

  useEffect(() => {
    const fetchDetails = async () => {
      if (id) {
        setLoading(true); 
        try {
          const res = await loadClassAndTeacherDetails(id);
          if (res) {
            setTeacherSubjects(res);
          }
        } finally {
          setLoading(false); 
        }
      }
    };

    fetchDetails();
  }, [id]);

  return (
    <Box sx={{ ml: '20px', mr: '20px' }}>
      {loading ? (
        <LoadingSpinner /> 
      ) : (
        <>
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

          {/* Profile Section */}
          <Box display="flex" alignItems="center" mb={2}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar alt="profile" src={image.books} sx={{ width: 100, height: 100 }} />
            </Box>
            <Box ml={3} mb={3}>
              <Typography variant="body1">
                <Box component="span" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  <strong>SUBJECT :</strong>{' '}
                </Box>
                <Box component="span" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {teacherSubjects[0]?.subjectName || 'NOT ASSIGNED'}
                </Box>
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h4" align="start">
              VIEW SUBJECT'S RESPECTIVE TEACHERS AND THEIR CLASSES
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
            gridAutoRows="140px"
            gap="20px"
          >
            {teacherSubjects.map((entry, index) => (
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
                  class_createdAt={
                    entry.clazz?.createdAt ? new Date(entry.clazz.createdAt).toLocaleDateString() : 'N/A'
                  }
                  class_status={entry.clazz?.status || 'N/A'}
                  name2="TEACHER"
                  subject={entry.teacher?.name || 'N/A'}
                  subject_createdAt={
                    entry.teacher?.createdAt ? new Date(entry.teacher.createdAt).toLocaleDateString() : 'N/A'
                  }
                  subject_status={entry.teacher?.status || 'N/A'}
                  icon={""}
                />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Subject_Data;
