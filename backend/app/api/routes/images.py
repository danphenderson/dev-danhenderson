# app/api/images.py
from fastapi import APIRouter, HTTPException, Depends

from app.core.db import get_async_session
from app.api.deps import get_image
from app import schemas, models
from pydantic import UUID4
from sqlalchemy import select

router : APIRouter = APIRouter(tags=["images"])

@router.post("/", status_code=201, response_model=UUID4) 
async def create_image(payload: schemas.ImageCreate, db = Depends(get_async_session)):
    image = models.Image(**payload.dict())
    db.add(image)
    await db.commit() 
    await db.refresh(image)
    return image.id

@router.get("/{id}/", status_code=202, response_model=schemas.ImageRead)
async def read_image(id: UUID4, image = Depends(get_image)):
    return schemas.ImageRead.from_orm(image)


@router.get("/", response_model=list[schemas.ImageRead])
async def read_images(db = Depends(get_async_session)):
    rows = await db.execute(select(models.Image))
    result = rows.scalars().all()
    if not result:
       raise HTTPException(status_code=404, detail="No images found")
    return result


@router.delete("/{id}/", status_code=202)
async def delete_image(id: UUID4, db = Depends(get_async_session)):
    image = await db.get(models.Image, id)
    await db.delete(image)
    await db.commit()


@router.put("/{id}/", status_code=202)
async def update_image(id: UUID4, payload: schemas.ImageUpdate, db = Depends(get_async_session)):
    image = await db.get(models.Image, id)
    for field, value in payload:
        setattr(image, field, value)
    await db.commit()
    await db.refresh(image)
    return image.id