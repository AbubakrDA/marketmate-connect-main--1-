from typing import Optional, List
from .base import CamelBaseModel
from datetime import datetime
from .business import Business

class ListingBase(CamelBaseModel):
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
    
    pass

class Listing(ListingInDBBase):
    business: Optional[Business] = None
