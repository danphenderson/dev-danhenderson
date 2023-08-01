"""
SQL Alchemy models declaration.
"""
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer,  String, UUID, ForeignKey
from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import DeclarativeBase, relationship

class Base(DeclarativeBase):
    id = Column(UUID, primary_key=True, default=uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(SQLAlchemyBaseUserTableUUID, Base):
    # FIXME: Disregarding user-to-model relationships for now.
    pass


class ContactForm(Base):
    """
    Represents a model for a contact form.
    """
    __tablename__ = "contact_form"
    name = Column(String, index=True)
    email = Column(String, index=True)
    message = Column(String)
    
    
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
    photo_gallery_id = Column("photo_gallery_id", UUID, ForeignKey("photo_gallery.id"))
    image_id = Column("image_id", UUID, ForeignKey("image.id"))




class ClimbingRoute(Base):
    """
    Represents a model for a climbing route.
    """
    __tablename__ = "climbing_route"
    
    date = Column(DateTime) 
    route_name = Column(String, index=True)
    rating = Column(String) 
    notes = Column(String)  
    url = Column(String)  
    pitches = Column(Integer) 
    location = Column(String) 
    avg_stars = Column(Float)
    your_stars = Column(Integer) 
    style = Column(String) 
    lead_style = Column(String) 
    route_type = Column(String)  
    your_rating = Column(String) 
    length = Column(Integer)  
    rating_code = Column(Integer)