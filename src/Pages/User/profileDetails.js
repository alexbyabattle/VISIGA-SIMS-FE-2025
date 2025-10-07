import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { tokens } from '../../theme';
import { useNavigate, useParams } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useUserService from '../../api/services/userService';
import EditPictureDialog from './EditPictureDialog';
import ChangePasswordDialog from './ChangePasswordDialog';
import * as image from '../../assets';
import LoadingSpinner from '../../components/LoadingSpinner';
import Header from "../../components/Header";

const ProfileDetails = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [changeImageDialogOpen, setChangeImageDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const userService = useUserService();
  const { isLoading } = userService;

  // Debug logging
  console.log('ProfileDetails - passwordDialogOpen:', passwordDialogOpen);

  

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleDateChange = (newValue) => {
    setUserData((prevData) => ({
      ...prevData,
      date_Of_Birth: newValue,
    }));
  };

  const user = getUserFromCookies();
  const id = user?.data?.id;

  useEffect(() => {
    if (id) {
      loadUserDetails();
    }
  }, [id]);

  const loadUserDetails = async () => {
    try {
      const data = await userService.loadUserDetails(id);
      setUserData(data);
      
    } catch (error) {
      console.error('Failed to load user details', error);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? dayjs(dateString).format('YYYY-MM-DD') : '';
  };

  const handleSaveAll = async () => {
    const updateUserDetailsDto = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phoneNumber: userData.phoneNumber,
      indexNumber: userData.studentNumber,
      gender: userData.gender,
      communityName: userData.communityName,
      parishName: userData.parishName,
      archdiocese: userData.archdiocese,
      createdAt: formatDate(userData.createdAt),
    };

    try {
      await userService.updateUserDetails(id, updateUserDetailsDto);
      loadUserDetails();
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  // 👉 Show loader when loading
  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: 'black' }} />
      </Container>
    );
  }

  return (
    <Box sx={{ padding: 1, maxWidth: 800, margin: 'auto' }}>
      <Header title="USER DETAILS" />

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
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item xs={12} md={8}>
                  <Box display="flex" alignItems="center">
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <Avatar
                        alt={userData.name || 'Profile Picture'}
                        src={userData.photoUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:8086'}${userData.photoUrl}` : null}
                        sx={{
                          width: 100,
                          height: 100,
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
                      <Typography variant="body1">
                        <strong>Role:</strong> {userData.role}
                      </Typography>

                      <Typography variant="body1">
                        <strong>Email:</strong> {userData.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ mt: { xs: 2, md: 0 } }}
                      onClick={() => {
                        
                        
                        setPasswordDialogOpen(true);
                      }}
                    >
                      Change Password
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="h4" gutterBottom>General Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="User Name" variant="outlined" name="name" value={userData.name || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" variant="outlined" name="email" value={userData.email || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" variant="outlined" name="phoneNumber" value={userData.phoneNumber || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="archdiocese" variant="outlined" name="archdiocese" value={userData.archdiocese || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="communityName" variant="outlined" name="communityName" value={userData.communityName || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="parishName" variant="outlined" name="parishName" value={userData.parishName || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Gender" variant="outlined" name="gender" value={userData.gender || ''} onChange={handleChange} />
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="createdAt"
                    value={userData.createdAt ? dayjs(userData.createdAt) : null}
                    onChange={handleDateChange}
                    disableFuture
                    views={['day', 'month', 'year', 'hours', 'minutes']}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </LocalizationProvider>
            </Grid>

            <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleSaveAll}>
              Save All
            </Button>
          </Box>
        )}

        <EditPictureDialog
          open={changeImageDialogOpen}
          onClose={() => setChangeImageDialogOpen(false)}
          loadUserDetails={loadUserDetails}
        />

        <ChangePasswordDialog
          open={passwordDialogOpen}
          onClose={() => setPasswordDialogOpen(false)}
          onSuccess={() => {
            setPasswordDialogOpen(false);
            loadUserDetails();
          }}
        />

      </Box>
    </Box>
  );
};

export default ProfileDetails;
