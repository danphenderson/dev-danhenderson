import * as React from 'react';
import {Grid, Paper, Box, Card, Container, TextField, Button } from '@mui/material';
import { Typography } from '@mui/material';
import { useState } from 'react';


export default function Contact() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the form submission here
    console.log(values);
  };
  
  return (
      <Grid container direction="row" component="main" sx={{ height: '100vh' }} >
        <Grid
          item
          component={Paper}
          xs={12}
          sm={12}
          md={12}
          sx={{
            backgroundImage: `url('assets/home.jpg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            loading: 'lazy',
          }}>
            <Box sx={{ my: 8, mx: 4 }}>
            <Typography component="h1" variant="h5">
        Contact Us
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%", 
          mt: 3,
        }}
      >
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoFocus
          value={values.name}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="message"
          label="Message"
          type="text"
          id="message"
          value={values.message}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Send Message
        </Button>
      </Box>
            </Box>
          </Grid>
      </Grid>
  );
  
}