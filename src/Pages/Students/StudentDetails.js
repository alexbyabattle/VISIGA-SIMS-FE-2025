import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  Button,
  CircularProgress,
  Container
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate, useParams } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import useStudentService from '../../api/services/studentService';
import EditStudentPictureDialog from '../User/EditStudentPhotoDialog';
import * as image from '../../assets';
import LoadingSpinner from '../../components/LoadingSpinner';
import Header from "../../components/Header";
import { formatDate } from '../../utils/utils';
import toast from 'react-hot-toast';

const StudentDetails = () => {
  const [loading, setLoading] = useState(false);
  const { studentId } = useParams();
  const [userData, setUserData] = useState(null);
  const [changeImageDialogOpen, setChangeImageDialogOpen] = useState(false);
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [joiningDate, setJoiningDate] = useState(null);
  const studentService = useStudentService();
  const { loadStudentDetails } = studentService;




  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleDateChange = (newValue, fieldName) => {
    setUserData((prevData) => ({
      ...prevData,
      [fieldName]: newValue,
    }));
  };


  useEffect(() => {
    if (studentId) {
      loadStudentData();
    }
  }, [studentId]);

  const formatDateForBackend = (dateString) => {
    return dateString ? dayjs(dateString).format('YYYY-MM-DDTHH:mm:ss') : '';
  };

  const loadStudentData = async () => {
    if (studentId) {
      try {
        setLoading(true);
        const data = await loadStudentDetails(studentId);
        setUserData(data);
        setGender(data?.gender || '');
        setDateOfBirth(data?.dateOfBirth ? dayjs(data.dateOfBirth) : null);
        setJoiningDate(data?.joiningDate ? dayjs(data.joiningDate) : null);
      } catch (error) {
        console.error("Error loading student data:", error);
        toast.error("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };


  const handleSaveAll = async () => {
    try {
      setLoading(true);
      
      const updateStudentDetailsDto = {
        studentName: userData.studentName,
        className: userData.className,
        parishName: userData.parishName,
        communityName: userData.communityName,
        indexNumber: userData.studentNumber,
        archdiocese: userData.archdiocese,
        combination: userData.combination,
        communityZone: userData.communityZone,
        parishPriest: userData.parishPriest,
        parishPriestPhoneNumber: userData.parishPriestPhoneNumber,
        disease: userData.disease,
        bloodGroup: userData.bloodGroup,
        role: userData.role,
        createdAt: formatDateForBackend(userData.createdAt),
        dateOfBirth: formatDateForBackend(userData.dateOfBirth)
      };

      await studentService.updateStudentDetails(studentId, updateStudentDetailsDto);
      toast.success("Student details updated successfully!");
      await loadStudentData();
    } catch (error) {
      console.error('Error updating user details:', error);
      toast.error("Failed to update student details. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: 'secondary' }} />
      </Container>
    );
  }

  return (
    <Box sx={{ padding: 1, maxWidth: 800, margin: 'auto' }}>
      <Header
        title="USER DETAILS"
      />


      <Box
        elevation={3}
        sx={{
          padding: 1,
          maxWidth: 900,
          margin: 'auto',
          border: '1px solid',
        }}
      >
        {userData && (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  alt={userData.studentName || 'Profile Picture'}
                  src={userData.photoUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:8086'}${userData.photoUrl}` : null}
                  sx={{
                    width: '100px',
                    height: '100px',
                    border: userData.photoUrl ? '2px solid #ccc' : '2px solid red',
                  }}
                />
                <Tooltip title="Choose image">
                  <IconButton
                    color="primary"
                    component="label"
                    sx={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#657073' }}
                    onClick={() => setChangeImageDialogOpen(true)}
                  >
                    <PhotoCamera />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box ml={2}>
                <Typography variant="body1"><strong>Index Number:</strong> {userData.studentNumber}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {userData.studentName}</Typography>
              </Box>
            </Box>

            <Typography variant="h4" gutterBottom>General Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Jina la mseminari" variant="outlined" name="studentName" value={userData.studentName || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Jimbo " variant="outlined" name="archdiocese" value={userData.archdiocese || ''} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth label="parokia" variant="outlined" name="parishName" value={userData.parishName || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Jina la Paroko" variant="outlined" name="parishPriest" value={userData.parishPriest || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Namba ya simu ya paroko" variant="outlined" name="parishPriestPhoneNumber" value={userData.parishPriestPhoneNumber || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="kanda" variant="outlined" name="communityZone" value={userData.communityZone || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Community Name" variant="outlined" name="communityName" value={userData.communityName || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Combination / studies" variant="outlined" name="combination" value={userData.combination || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Siku ya kuzaliwa"
                    value={userData.dateOfBirth ? dayjs(userData.dateOfBirth) : null}
                    onChange={(newValue) => handleDateChange(newValue, 'dateOfBirth')}
                    disableFuture
                    views={['day', 'month', 'year', 'hours', 'minutes']}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>



              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Anasumbuliwa na gonjwa lolote" variant="outlined" name="disease" value={userData.disease || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Kundi la damu" variant="outlined" name="bloodGroup" value={userData.bloodGroup || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Created At"
                    value={userData.createdAt ? dayjs(userData.createdAt) : null}
                    onChange={(newValue) => handleDateChange(newValue, 'createdAt')}
                    disableFuture
                    views={['day', 'month', 'year', 'hours', 'minutes']}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" color="secondary" onClick={handleSaveAll}>
                Save All
              </Button>
            </Box>
          </Box>
        )}

        <EditStudentPictureDialog
          open={changeImageDialogOpen}
          onClose={() => setChangeImageDialogOpen(false)}
          loadStudentData={loadStudentData}
          studentId={studentId}
        />

      </Box>
    </Box>
  );
};

export default StudentDetails;
