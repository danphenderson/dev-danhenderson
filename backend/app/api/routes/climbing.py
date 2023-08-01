# app/api/contact.py
from fastapi import APIRouter, HTTPException
from app.logging import console_log


router : APIRouter = APIRouter(tags=["climbing"])


@router.get("/climbing/ticks", response_model=list[dict])
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