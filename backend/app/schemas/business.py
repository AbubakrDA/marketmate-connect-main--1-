from typing import Optional
from .base import CamelBaseModel

class BusinessBase(CamelBaseModel):
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
    
    pass

class Business(BusinessInDBBase):
    pass
