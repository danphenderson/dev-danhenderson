import uuid

from pydantic import BaseModel as _BaseModel, UUID4
from datetime import datetime 

from fastapi_users import schemas

class BaseModel(_BaseModel):
    class Config:
        orm_mode = True
        extra='allow'

class BaseRead(BaseModel):
    id: UUID4 | str
    created_at: datetime
    updated_at: datetime


class UserRead(schemas.BaseUser[uuid.UUID]):
    # TODO: FastAPI-Users should implement a UUID4 type
    # reference documentation for details.
    pass

class UserCreate(schemas.BaseUserCreate):
    pass

class UserUpdate(schemas.BaseUserUpdate):
    pass

