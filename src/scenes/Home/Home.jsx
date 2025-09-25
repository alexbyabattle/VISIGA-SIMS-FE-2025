import React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import image from '../../data/image';
import './Home.css';

const Home = () => {
    return (
        <div className='app__header'>
            <Grid container alignItems="center" justifyContent="center">
                <div>
                    <img src={image.headerimg} alt="header-image" />
                </div>
            </Grid>

            <Grid container alignItems="center" justifyContent="center" className='app__header-content'>
                <Typography variant="h4" gutterBottom>
                    INCIDENT REPORT SYSTEM
                </Typography>
                <Typography variant="body1">
                    The Incident Report System at the Greater City Learning Academy (GCLA) is pivotal in maintaining a secure environment. It documents unforeseen events, enabling timely responses and improvements in safety protocols. By analyzing data, GCLA identifies patterns and ensures transparency, fostering a safer institution for all.
                </Typography>

                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Button variant="contained" color="primary" size="large">
                            Login
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="primary" size="large">
                            Register
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default Home;
