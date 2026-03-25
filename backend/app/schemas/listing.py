from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class ListingBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    price_egp: Optional[float] = None
    old_price_egp: Optional[float] = None
    deal_label: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    video_url: Optional[str] = None
    status: Optional[str] = "active"

class ListingCreate(ListingBase):
    id: str
    business_id: str
    title: str
    category: str
    price_egp: float
    image_url: str

class ListingUpdate(ListingBase):
    pass

class ListingInDBBase(ListingBase):
    id: str
    business_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Listing(ListingInDBBase):
    pass
