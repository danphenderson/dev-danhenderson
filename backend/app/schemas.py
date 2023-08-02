import uuid

from pydantic import BaseModel as _BaseModel, UUID4
from datetime import datetime 

from fastapi_users import schemas

class BaseModel(_BaseModel):
    class Config:
        from_attributes = True

class BaseRead(BaseModel):
    id: UUID4 | str
    created_at: datetime
    updated_at: datetime

# User schemas
class UserRead(schemas.BaseUser[uuid.UUID]):
    # TODO: FastAPI-Users should implement a UUID4 type
    # reference documentation for details.
    pass

class UserCreate(schemas.BaseUserCreate):
    pass

class UserUpdate(schemas.BaseUserUpdate):
    pass


# Contact form schemas
class BaseContactForm(BaseModel):
    name: str | None = None
    email: str | None = None
    message: str | None = None

class ContactFormRead(BaseContactForm, BaseRead):
    pass

class ContactFormCreate(BaseContactForm):
    name: str
    email: str
    message: str


# Photo gallery schemas
class BasePhotoGallery(BaseModel):
    title: str | None = None
    description: str | None = None
    src: str | None = None

class PhotoGalleryRead(BasePhotoGallery, BaseRead):
    pass

class PhotoGalleryImagesRead(PhotoGalleryRead):
    images: list

class PhotoGalleryCreate(BasePhotoGallery):
    title: str
    src: str

class PhotoGalleryUpdate(BasePhotoGallery):
    id: UUID4


# Image schemas
class BaseImage(BaseModel):
    title: str | None = None
    description: str | None = None
    src: str | None = None

class ImageRead(BaseImage, BaseRead):
    pass

class ImageCreate(BaseImage):
    title: str
    src: str

class ImagePhotoGalleryRead(ImageRead):
    photo_gallery: list



class ImageUpdate(BaseImage):
    id: UUID4



class OpenWeatherRead(BaseModel):
    temperature: float
    humidity: int
    pressure: int
    weather_description: str
    wind_speed: float
    city: str
    state: str