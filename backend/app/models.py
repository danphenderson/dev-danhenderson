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