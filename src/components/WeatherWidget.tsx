import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

interface WeatherWidgetProps {
  city: string;
  state?: string;
}

interface OpenWeatherRead {
  temperature: number;
  humidity: number;
  pressure: number;
  weather_description: string;
  wind_speed: number;
  city: string;
  state: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ city, state }) => {
  const [weatherData, setWeatherData] = useState<OpenWeatherRead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/climbing/weather?city=${city}&state=${state}`);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city, state]);

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h5">Weather in {city}, {state || ''}</Typography>
      {loading ? (
        <CircularProgress />
      ) : weatherData ? (
        <Box>
          <Typography variant="body1">Temperature: {weatherData.temperature}°C</Typography>
          <Typography variant="body1">Humidity: {weatherData.humidity}%</Typography>
          <Typography variant="body1">Pressure: {weatherData.pressure} hPa</Typography>
          <Typography variant="body1">Wind Speed: {weatherData.wind_speed} m/s</Typography>
          <Typography variant="body1">Description: {weatherData.weather_description}</Typography>
        </Box>
      ) : (
        <Typography variant="body1">Failed to fetch weather data.</Typography>
      )}
    </Paper>
  );
};

export default WeatherWidget;