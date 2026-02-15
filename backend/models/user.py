"""Модели пользователя."""
from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: str
    tier: str = "free"  # free | premium | pro

    class Config:
        from_attributes = True
