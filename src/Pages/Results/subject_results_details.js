import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Avatar,
  Button,
  Tooltip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { PhotoCamera } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import image from '../../data/image';
import DetailsBox from '../../components/DetailsBox';
import { tokens } from '../../theme';


const Subject_results_Data = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [teacherSubjects, setTeacherSubjects] = useState([]);

  const {
    loadTeacherSubjects,
  } = useTeacherService();

  useEffect(() => {
    if (id) {
      loadTeacherSubjects(id).then(data => {
        setTeacherSubjects(data);
      });
    }
  }, [id]);

  const openClassExamsPage = (subjectId, teacherId, clazzId) => {
    navigate(`/class_exams/${subjectId}`, {
      state: {
        subjectId,
        teacherId,
        clazzId,
      },
    });
  };



  return (
    <Box sx={{ ml: '20px', mr: '20px' }}>
      {/* Header Section */}
      <Box
        height="100px"
        sx={{
          padding: 0,
          border: `1px solid ${borderColor}`,
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <Box
          sx={{
            flex: 1,
            borderRight: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            p: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            alt="visigaseminary"
            src={image.visigalogo}
            sx={{
              height: 80,
              width: 80,
              objectFit: 'contain',
              mr: 2,
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            St Mary's Junior Seminary (VISIGA SEMINARY)
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            borderRight: `1px solid ${borderColor}`,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" align="center">
            <h1>TEACHER DETAILS</h1>
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            borderRight: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            p: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            alt="archdiocise"
            src={image.cathedral5}
            sx={{
              height: 80,
              width: 80,
              objectFit: 'contain',
              mr: 2,
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Seminary under Archdiocese of Dar es Salaam
          </Typography>
        </Box>
      </Box>

      {/* Profile Section */}
      <Box display="flex" alignItems="center" mb={2}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar alt="profile" src={image.cathedral5} sx={{ width: 100, height: 100 }} />
          <Tooltip title="Choose image">
            <IconButton
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#657073',
              }}
            >
              <PhotoCamera />
            </IconButton>
          </Tooltip>
        </Box>
        <Box ml={3} mb={3}>
          <Typography variant="body1">
            <strong>Name:</strong> {teacherSubjects[0]?.name || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {teacherSubjects[0]?.email || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {teacherSubjects[0]?.phoneNumber || 'N/A'}
          </Typography>
        </Box>

      </Box>

      {/* Subjects Section */}
      <Box>
        <Typography variant="h4" align="start">VIEW SUBJECTS ASSIGNED</Typography>
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
                entry.clazz?.createdAt
                  ? new Date(entry.clazz.createdAt).toLocaleDateString()
                  : 'N/A'
              }
              class_status={entry.clazz?.status || 'N/A'}
              name2="SUBJECT"
              subject={entry.subject?.subjectName || 'N/A'}
              subject_createdAt={
                entry.subject?.createdAt
                  ? new Date(entry.subject.createdAt).toLocaleDateString()
                  : 'N/A'
              }
              subject_status={entry.subject?.status || 'N/A'}
              icon={
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    openClassExamsPage(entry.subject.id, entry.id, entry.clazz.id)
                  }
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

export default Subject_results_Data;
