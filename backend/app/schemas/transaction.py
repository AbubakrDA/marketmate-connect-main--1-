from typing import Optional, List
from .base import CamelBaseModel
from datetime import datetime

class BuyerRequestBase(CamelBaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    date_needed: Optional[str] = None
    status: Optional[str] = "open"

class BuyerRequestCreate(BuyerRequestBase):
    id: str
    user_id: str
    title: str
    category: str
    city: str
    area: str

class BuyerRequestUpdate(BuyerRequestBase):
    pass

class BuyerRequestInDBBase(BuyerRequestBase):
    id: str
    user_id: str
    created_at: datetime
    
class BuyerRequest(BuyerRequestInDBBase):
    pass

class OfferBase(CamelBaseModel):
    offer_title: Optional[str] = None
    offer_message: Optional[str] = None
    offer_price: Optional[float] = None
    listing_reference: Optional[str] = None
    status: Optional[str] = "pending"

class OfferCreate(OfferBase):
    id: str
    request_id: str
    business_id: str
    offer_title: str
    offer_message: str
    offer_price: float

class OfferUpdate(OfferBase):
    pass

class OfferInDBBase(OfferBase):
    id: str
    request_id: str
    business_id: str
    created_at: datetime
    
    pass

class Offer(OfferInDBBase):
    pass
