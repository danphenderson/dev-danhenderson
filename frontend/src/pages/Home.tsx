import React from "react";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box >
      <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
        Home Page
      </Typography>
    </Box>
  );
}