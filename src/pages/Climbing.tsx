import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BackgroundPaper from '../components/BackgroundPaper';

const columns = [
  { field: 'Date', headerName: 'Date', flex: 1 },
  { field: 'Route', headerName: 'Route', flex: 1 },
  { field: 'URL', headerName: 'URL', flex: 1 },
];

type Tick = {
  id: string;
  Date: string;
  Route: string;
  URL: string;
};

export default function Climbing() {
  const [ticks, setTicks] = useState<Tick[]>([]);

  useEffect(() => {
    fetch('https://www.mountainproject.com/rss/user-ticks/200318932')
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');

        const parsedTicks = Array.from(items).map(item => ({
          id: item.querySelector('guid')?.textContent || "",
          Date: new Date(item.querySelector('pubDate')?.textContent || "").toLocaleDateString(),
          Route: (item.querySelector('title')?.textContent || "").replace('Tick: ', ''),
          URL: item.querySelector('link')?.textContent || "",
        }));

        setTicks(parsedTicks);
      });
  }, []);

  return (
    <BackgroundPaper image='assets/photography/landscape/landscape-lime-kiln.jpg'>
      {/* Left Section (Profile Section) TODO: Update ME */}
      <Paper elevation={3} sx={{ padding: 2, marginY: 4 }}>
        {/* Name and Title */}
        <Typography variant="h2">
          Recorded Ascents
        </Typography>
        <DataGrid rows={ticks} columns={columns} autoHeight/>
      </Paper>
    </BackgroundPaper>
  );
}