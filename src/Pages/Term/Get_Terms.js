import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import image from '../../data/image';
import DetailsBox from '../../components/DetailsBox';
import { tokens } from '../../theme';
import useTermService from '../../api/services/termService';


const Term_Data = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [termDetails, setTermDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { loadTermDetails, loadTermClasses } = useTermService();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const termData = await loadTermDetails(id);
          const termClassesData = await loadTermClasses(id);
          setTermDetails({ ...termData, classes: termClassesData || [] });
        } catch (error) {
          console.error('Failed to load term data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  const openClassExamsPage = (subjectId, termId, clazzId) => {
    navigate(`/class_exams/${subjectId}/${termId}/${clazzId}`);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading term data..." height="60vh" />;
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
            CLASSES AND SUBJECTS IN THIS TERM
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
          <Avatar alt="term" src={image.termIcon} sx={{ width: 100, height: 100 }} />
        </Box>
        <Box ml={3} mb={3}>
          <Typography variant="body1">
            <strong>Term Name:</strong> {termDetails?.termName || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Created At:</strong> {termDetails?.createdAt || 'N/A'}
          </Typography>
        </Box>
      </Box>

      {/* Classes Section */}
      <Box>
        <Typography variant="h4" align="start">CLASSES UNDER THIS TERM</Typography>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gridAutoRows="140px"
        gap="20px"
      >
        {termDetails?.classes?.map((entry, index) => (
          <Box
            key={index}
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <DetailsBox
              name1="CLASS"
              clazz={entry.className || 'N/A'}
              class_createdAt={entry.classType || 'N/A'}
              class_status={entry.status || 'N/A'}
              name2="SUBJECTS"
              subject={entry.subjects?.map(s => s.subjectName).join(', ') || 'N/A'}
              subject_createdAt="Examined By NECTA"
              subject_status="Active"
              icon={
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openClassExamsPage(entry.subjects?.[0]?.id, termDetails.id, entry.id)}
                >
                  VIEW & ADD RESULTS
                </Button>
              }
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Term_Data;
