from typing import Optional
from pydantic import BaseModel

class BusinessBase(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    logo_url: Optional[str] = None
    verified: Optional[bool] = False

class BusinessCreate(BusinessBase):
    id: str
    owner_user_id: str
    name: str
    category: str

class BusinessUpdate(BusinessBase):
    pass

class BusinessInDBBase(BusinessBase):
    id: str
    owner_user_id: str
    rating: float = 0.0
    review_count: int = 0
    
    class Config:
        from_attributes = True

class Business(BusinessInDBBase):
    pass
