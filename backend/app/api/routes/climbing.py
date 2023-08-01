# app/api/contact.py
from fastapi import APIRouter, HTTPException, Depends

from app.core.db import get_async_session
from app import schemas, models
from pydantic import UUID4
from sqlalchemy import select
from app.logging import console_log


router : APIRouter = APIRouter(tags=["climbing"])