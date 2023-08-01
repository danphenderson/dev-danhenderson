# app/api/photo_gallery.py

from fastapi import APIRouter, HTTPException, Depends
from app.logging import console_log
from app.core.db import get_async_session
from app import schemas, models
from pydantic import UUID4
from sqlalchemy import select

router : APIRouter = APIRouter(tags=["photography"])


async def get_image(id: UUID4, db = Depends(get_async_session)) -> models.Image:
    image = await db.get(models.Image, id)
    if not image:
        console_log.info(f"image with id {id} not found")
        raise HTTPException(status_code=404, detail=f"image with {id} not found")
    return image




@router.post("/collection", status_code=201, response_model=schemas.PhotoGalleryRead)
async def create_photo_gallery(
    payload: schemas.PhotoGalleryCreate,
    db = Depends(get_async_session)
):
    photo_gallery = models.PhotoGallery(**payload.model_dump())

    try:
        db.add(photo_gallery)
        await db.commit()
        await db.refresh(photo_gallery)
        return schemas.ContactFormRead.from_orm(photo_gallery)

    except Exception as _:
        console_log.exception("Error creating photo gallery")

@router.get("/collection", response_model=list[schemas.PhotoGalleryRead])
async def read_photo_galleries(
    db = Depends(get_async_session)
):
    query = select(models.PhotoGallery)
    res = await db.execute(query)
    return [schemas.PhotoGalleryRead.from_orm(pg) for pg in res.scalars()]


@router.get("/collection/{id}", response_model=schemas.PhotoGalleryImagesRead)
async def read_photo_gallery(
    id: UUID4,
    db = Depends(get_async_session)
):
    photo_gallery = await db.get(models.PhotoGallery, id)
    if not photo_gallery:
        console_log.info(f"photo gallery with id {id} not found")
        raise HTTPException(status_code=404, detail=f"photo gallery with {id} not found")
    return schemas.PhotoGalleryImagesRead.from_orm(photo_gallery)

@router.post("/image", status_code=201, response_model=schemas.ImageRead)
async def create_image(
    payload: schemas.ImageCreate,
    db = Depends(get_async_session)
):
    image = models.Image(**payload.model_dump())

    try:
        db.add(image)
        await db.commit()
        await db.refresh(image)
        return schemas.ImageRead.from_orm(image)
    except Exception as _:
        console_log.exception("Error creating image")


@router.get("/image/{id}", response_model=list[schemas.ImageRead])
async def read_image(
    id: UUID4,
    db = Depends(get_async_session)
):
    image = await db.get(models.Image, id)
    if not image:
        console_log.info(f"image with id {id} not found")
        raise HTTPException(status_code=404, detail=f"image with {id} not found")
    return schemas.ImageRead.from_orm(image)