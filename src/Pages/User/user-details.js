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
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Container
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import EditPictureDialog from './EditPictureDialog';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { formatDate } from '../../utils/utils';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import useUserService from '../../api/services/userService';
import Header from "../../components/Header";


const UserDetails = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [changeImageDialogOpen, setChangeImageDialogOpen] = useState(false);
  const [gender, setGender] = useState('');
  const userService = useUserService();
  const { isLoading } = userService;

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleDateChange = (newValue) => {
    setUserData((prevData) => ({
      ...prevData,
      date_Of_Birth: newValue,
    }));
  };

  useEffect(() => {
    if (userId) {
      loadUserDetails();
    }
  }, [userId]);

  const loadUserDetails = async () => {
    try {
      const data = await userService.loadUserDetails(userId);
      setUserData(data);
      setGender(data.gender || '');
    } catch (error) {
      console.error('Failed to load user details', error);
    }
  };

  const handleSaveAll = async () => {
    const updateUserDetailsDto = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phoneNumber: userData.phoneNumber,
      gender: gender,
      parishName: userData.parishName,
      communityName: userData.communityName,
      archdiocese: userData.archdiocese,
      createdAt: formatDate(userData.createdAt),
    };

    try {
      await userService.updateUserDetails(userId, updateUserDetailsDto);
      loadUserDetails();
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  // 👉 Show loading spinner if still loading
  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: 'black' }} />
      </Container>
    );
  }

  return (
    <Box sx={{ padding: 1, maxWidth: 800, margin: 'auto' }}>
      <Header
        title="USER DETAILS"
        buttonText="VIEW SESSION"
        navigateTo={`/sessions/${userId}`}
        buttonVariant="contained"
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
                  alt={userData.name || 'Profile Picture'}
                  src={userData.photoUrl || userData.profilePicture}
                  sx={{
                    width: '100px',
                    height: '100px',
                    border: userData.photoUrl || userData.profilePicture ? '2px solid #ccc' : '2px solid red',
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
                <Typography variant="body1"><strong>Role:</strong> {userData.role}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {userData.email}</Typography>
              </Box>
            </Box>

            <Typography variant="h4" gutterBottom>General Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="User Name" variant="outlined" name="name" value={userData.name || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Email" variant="outlined" name="email" value={userData.email || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Role" variant="outlined" name="role" value={userData.role || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Phone Number" variant="outlined" name="phoneNumber" value={userData.phoneNumber || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Archdiocese" variant="outlined" name="archdiocese" value={userData.archdiocese || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Parish Name" variant="outlined" name="parishName" value={userData.parishName || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Community Name" variant="outlined" name="communityName" value={userData.communityName || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Created At"
                    value={userData.createdAt ? dayjs(userData.createdAt) : null}
                    onChange={handleDateChange}
                    disableFuture
                    views={['day', 'month', 'year', 'hours', 'minutes']}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>Gender</Typography>
                <RadioGroup row value={gender} onChange={handleGenderChange}>
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
              </Grid>
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
      </Box>
    </Box>
  );
};

export default UserDetails;
