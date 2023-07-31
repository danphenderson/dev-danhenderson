"""
SQL Alchemy models declaration.

Note, imported by alembic migrations logic, see `alembic/env.py`
"""
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, DateTime,  String, UUID, ForeignKey
from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import DeclarativeBase, relationship

class Base(DeclarativeBase):
    id = Column(UUID, primary_key=True, default=uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(SQLAlchemyBaseUserTableUUID, Base):
    # FIXME: Disregarding user-to-model relationships for now.
    pass


class PhotoGallery(Base):
    """
    Represents a model for a photo gallery.

    It defines a many-to-many relationship with the `Image` model.`
    """
    __tablename__ = "photo_gallery"
    title = Column(String, unique=True, index=True)
    description = Column(String)
    src = Column(String)
    images = relationship("Image", secondary="photo_gallery_x_image", back_populates="photo_gallery")


class Image(Base):
    """
    Represents a model for an image.

    It defines a many-to-many relationship with the `PhotoGallery` model.
    """
    __tablename__ = "image"
    title = Column(String, unique=True, index=True)
    description = Column(String)
    src = Column(String)
    photo_gallery = relationship(PhotoGallery, secondary="photo_gallery_x_image", back_populates="images")


class PhotoGalleryXImage(Base):
    """
    Represents a model for a photo gallery to image relationship.
    """
    __tablename__ = "photo_gallery_x_image"
    photo_gallery_id = Column(UUID, ForeignKey("photo_gallery.id"))
    image_id = Column(UUID, ForeignKey("image.id"))