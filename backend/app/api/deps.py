from fastapi import Depends, HTTPException
from pydantic import UUID4
from app.core.security import fastapi_users, get_current_user, get_current_superuser
from app.core.db import get_async_session
from app.logging import console_log
from app import models, schemas
