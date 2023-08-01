# app/api/photo_gallery.py
from fastapi import APIRouter, HTTPException, Depends
from app.logging import console_log
from app.core.db import get_async_session
from app.api.deps import get_photo_gallery
from app import schemas, models
from pydantic import UUID4
from sqlalchemy import select

router : APIRouter = APIRouter(tags=["photography"])

@router.post("/collection", status_code=201, response_model=schemas.PhotoGalleryRead)
async def create_photo_gallery(
    payload: schemas.PhotoGalleryCreate,
    db = Depends(get_async_session)
):
    photo_gallery = models.PhotoGallery(**payload.model_dump())
    db.add(photo_gallery)
    await db.commit()
    await db.refresh(photo_gallery)
    return photo_gallery.id

@router.get("/collection", response_model=list[schemas.PhotoGalleryRead])
async def read_photo_galleries(
    db = Depends(get_async_session)
):
    query = select(models.PhotoGallery)
    res = await db.execute(query)
    return [schemas.PhotoGalleryRead.from_orm(pg) for pg in res.scalars()]
