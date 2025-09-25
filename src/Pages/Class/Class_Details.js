import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Button, Avatar, Tooltip, IconButton } from '@mui/material';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import useClassService from '../../api/services/ClassService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import UnassignmentDialog from './ClassUnassignmentDialog';
import AssignmentDialog from './Class_Assignment';
import { AddToQueue, DoDisturbOn } from '@mui/icons-material';
import SubjectAssignmentDialog from '../Subjects/SubjectAssignment';
import DetailsBox from '../../components/DetailsBox';
import * as image from '../../assets';

const Class_Data = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);
  const [classSubjects, setClassSubjects] = useState([]);
  const [clazz, setClazz] = useState(null);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isUnAssignmentDialogOpen, setIsUnAssignmentDialogOpen] = useState(false);
  const [isSubjectAssignmentDialogOpen, setIsSubjectAssignmentDialogOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const openAssignmentDialog = () => {
    setIsAssignmentDialogOpen(true);
  };

  const openUnAssignmentDialog = () => {
    setIsUnAssignmentDialogOpen(true);
  };

  const {
    loadClassDetails,
    getClassById
  } = useClassService();

  useEffect(() => {
    if (id) {
      setIsLoading(true); // Set loading to true when starting to fetch data
      
      Promise.all([
        loadClassDetails(id).then(data => {
          setClassSubjects(data);
        }),
        getClassById(id).then(response => {
          setClazz(response);
        })
      ]).finally(() => {
        setIsLoading(false); 
      });
    }
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ ml: '20px', mr: '20px' }}>
      <AssignmentDialog
        clazzId={id}
        open={isAssignmentDialogOpen}
        onClose={() => setIsAssignmentDialogOpen(false)}
        onSuccess={() => {
          setIsLoading(true);
          loadClassDetails(id)
            .then(data => setClassSubjects(data))
            .finally(() => setIsLoading(false));
        }}
      />

      <UnassignmentDialog
        clazzId={id}
        open={isUnAssignmentDialogOpen}
        onClose={() => setIsUnAssignmentDialogOpen(false)}
        onSuccess={() => {
          setIsLoading(true);
          loadClassDetails(id)
            .then(data => setClassSubjects(data))
            .finally(() => setIsLoading(false));
        }}
      />

      <SubjectAssignmentDialog
        clazzId={id}
        subjectId={selectedSubjectId}
        open={isSubjectAssignmentDialogOpen}
        onClose={() => setIsSubjectAssignmentDialogOpen(false)}
        onSuccess={() => {
          setIsLoading(true);
          loadClassDetails(id)
            .then(data => setClassSubjects(data))
            .finally(() => setIsLoading(false));
        }}
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
              Details of Classes with Their Respective Subjects and Assigned Teachers
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
            <strong>Class Name:</strong> {clazz?.className || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Created At:</strong> {clazz?.createdAt ? new Date(clazz.createdAt).toLocaleString() : 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {clazz?.status || 'N/A'}
          </Typography>
        </Box>
      </Box>

      <Box flex="1" marginRight="16px" justifyContent="row">
        <Tooltip title="Assign subject to a Class">
          <IconButton color="success" onClick={() => openAssignmentDialog(id)}>
            <AddToQueue style={{ color: "success", fontSize: 32 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Unassign subject from a class">
          <IconButton color="success" onClick={() => openUnAssignmentDialog(id)}>
            <DoDisturbOn style={{ color: "red", fontSize: 32 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box>
        <Typography variant="h4" align="start"> VIEW SUBJECTS ASSIGNED </Typography>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gridAutoRows="140px"
        gap="20px"
      >
        {classSubjects.map((entry, index) => (
          <Box
            key={index}
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <DetailsBox
              name1="TEACHER"
              clazz={entry.teacher?.name || 'N/A'}
              class_createdAt={
                entry.teacher?.createdAt
                  ? new Date(entry.clazz.createdAt).toLocaleDateString()
                  : 'N/A'
              }
              class_status={entry.teacher?.status || 'N/A'}
              name2="SUBJECT"
              subject={entry.subject?.subjectName || 'N/A'}
              subject_createdAt={
                entry.subject?.createdAt
                  ? new Date(entry.subject.createdAt).toLocaleDateString()
                  : 'N/A'
              }
              subject_status={entry.subject?.status || 'N/A'}
              icon={
                <Box flex="1" marginRight="16px" justifyContent="row">
                  <Tooltip title="Assign teacher to subject">
                    <IconButton
                      color="success"
                      onClick={() => {
                        setSelectedSubjectId(entry.subject?.id);
                        setIsSubjectAssignmentDialogOpen(true);
                      }}
                    >
                      <AddToQueue style={{ color: "success", fontSize: 32 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Class_Data;