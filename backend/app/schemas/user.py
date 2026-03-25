from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = "user"
    phone: Optional[str] = None

class UserCreate(UserBase):
    id: str
    email: EmailStr
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: str
    rating: float = 0.0
    review_count: int = 0
    
    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str
