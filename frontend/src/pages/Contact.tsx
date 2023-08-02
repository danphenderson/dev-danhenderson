import * as React from 'react';
import {Grid, Paper, Box, Card, Container, TextField, Button } from '@mui/material';
import { Typography } from '@mui/material';
import { useState } from 'react';
import BackgroundPaper from '../components/BackgroundPaper';


export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <BackgroundPaper image='assets/photography/landscape/landscape-lime-kiln.jpg'>
      <Typography variant="h4" gutterBottom>Contact Me</Typography>
      <TextField
        fullWidth
        label="Name"
        variant="outlined"
        margin="normal"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        margin="normal"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Message"
        variant="outlined"
        margin="normal"
        name="message"
        multiline
        rows={4}
        value={formData.message}
        onChange={handleChange}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </BackgroundPaper>
  );
  
}