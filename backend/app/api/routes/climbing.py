# app/api/climbing.py
from token import OP
from fastapi import APIRouter, HTTPException, Query

import httpx
import feedparser
from typing import  Any


from app.logging import console_log
from app.schemas import OpenWeatherRead
from app.core.conf import settings

router : APIRouter = APIRouter(tags=["climbing"])


@router.get("/ticks", response_model=list[dict[str, Any]], status_code=200)
async def get_ticks():
    """
    Fetches all ticks from mountain projects rss XML feed.
    """
    url = "https://www.mountainproject.com/rss/user-ticks/200318932"
    
    # Use httpx to asynchronously fetch the data
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    
    # Check if request was successful
    if response.status_code != 200:
        console_log.error(f"Failed to fetch mountain project ticks with status code {response.status_code}")
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch mountain project ticks")

    # Parse the XML response
    feed = feedparser.parse(response.text)

    # Extract the entries (ticks) from the feed
    ticks = [
        {key: entry[key] for key in entry}
        for entry in feed.entries
    ]

    return ticks

@router.get("/weather", response_model=OpenWeatherRead)
async def get_weather(
    city: str = Query(..., description="City name"),
    state: str | None = Query(None, description="State name (Optional)"),
):
    """
    Fetches the weather data for a given city and state.
    """
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city},{state}&appid={settings.OPEN_WEATHER_API_KEY}&units=metric"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    # Check if request was successful
    if response.status_code != 200:
        console_log.error(f"Failed to fetch weather data with status code {response.status_code}")
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch weather data")

    weather_data = response.json()

    # Mapping the response to the WeatherResponse 
    weather_info = OpenWeatherRead(
        temperature=weather_data["main"]["temp"],
        humidity=weather_data["main"]["humidity"],
        pressure=weather_data["main"]["pressure"],
        weather_description=weather_data["weather"][0]["description"],
        wind_speed=weather_data["wind"]["speed"],
        city=city,
        state=state or "",
    )

    return weather_info