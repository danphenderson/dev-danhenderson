from fastapi import Depends, HTTPException
from pydantic import UUID4
from app.core.security import fastapi_users, get_current_user, get_current_superuser
from app.core.db import get_async_session
from app.logging import console_log
from app import models, schemas


async def get_photo_gallery(id: UUID4, db = Depends(get_async_session)) -> models.PhotoGallery:
    photo_gallery = await db.get(models.PhotoGallery, id)
    if not photo_gallery:
        console_log.info(f"PhotoGallery with id {id} not found")
        raise HTTPException(status_code=404, detail=f"PhotoGallery with {id} not found")
    return photo_gallery

async def get_image(id: UUID4, db = Depends(get_async_session)) -> models.Image:
    image = await db.get(models.Image, id)
    if not image:
        console_log.info(f"Image with id {id} not found")
        raise HTTPException(status_code=404, detail=f"Image with {id} not found")
    return image