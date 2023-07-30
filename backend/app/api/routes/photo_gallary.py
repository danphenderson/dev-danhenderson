# app/api/photo_gallery.py
from fastapi import APIRouter, HTTPException, Depends

from app.core.db import get_async_session
from app.api.deps import get_photo_gallery
from app import schemas, models
from pydantic import UUID4
from sqlalchemy import select

router : APIRouter = APIRouter(tags=["photo_gallary"])

@router.post("/", status_code=201, response_model=UUID4)
async def create_photo_gallery(payload: schemas.PhotoGalleryCreate, db = Depends(get_async_session)):
    photo_gallery = models.PhotoGallery(**payload.dict())
    db.add(photo_gallery)
    await db.commit()
    await db.refresh(photo_gallery)
    return photo_gallery.id

@router.get("/{id}/", status_code=202, response_model=schemas.PhotoGalleryRead)
async def read_photo_gallery(id: UUID4, photo_gallery = Depends(get_photo_gallery)):
    return schemas.PhotoGalleryRead.from_orm(photo_gallery)

@router.get("/", response_model=list[schemas.PhotoGalleryRead])
async def read_photo_galleries(db = Depends(get_async_session)):
    rows = await db.execute(select(models.PhotoGallery))
    result = rows.scalars().all()
    if not result:
       raise HTTPException(status_code=404, detail="No photo_galleries found")
    return result

@router.delete("/{id}/", status_code=202)
async def delete_photo_gallery(id: UUID4, db = Depends(get_async_session)):
    photo_gallery = await db.get(models.PhotoGallery, id)
    await db.delete(photo_gallery)
    await db.commit()

@router.put("/{id}/", status_code=202)
async def update_photo_gallery(id: UUID4, payload: schemas.PhotoGalleryUpdate, db = Depends(get_async_session)):
    photo_gallery = await db.get(models.PhotoGallery, id)
    for field, value in payload:
        setattr(photo_gallery, field, value)
    await db.commit()
    await db.refresh(photo_gallery)
    return photo_gallery.id
