# app/api/contact.py
from fastapi import APIRouter, HTTPException, Depends

from app.core.db import get_async_session
from app import schemas, models
from pydantic import UUID4
from sqlalchemy import select
from app.logging import console_log

router : APIRouter = APIRouter(tags=["contact"])


@router.post("/", response_model=schemas.ContactFormRead, status_code=201)
async def create_contact(
    payload: schemas.ContactFormCreate,
    db = Depends(get_async_session),
) -> schemas.ContactFormRead:
    new_contact = models.ContactForm(**payload.dict())

    console_log.critical("Creating new contact form entry")
    console_log.critical(new_contact)

    db.add(new_contact)
    await db.commit()
    await db.refresh(new_contact)
    return schemas.ContactFormRead.from_orm(new_contact)