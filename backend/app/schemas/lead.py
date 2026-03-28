from typing import Optional
from .base import CamelBaseModel
from datetime import datetime

class LeadBase(CamelBaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    message: Optional[str] = None
    lead_type: Optional[str] = "whatsapp"
    price: Optional[float] = 0.0
    status: Optional[str] = "new"

class LeadCreate(LeadBase):
    id: str
    listing_id: str
    business_id: str
    name: str
    email: str
    phone: str
    message: str
    lead_type: str = "whatsapp"
    price: float = 0.0

class LeadUpdate(LeadBase):
    pass

class LeadInDBBase(LeadBase):
    id: str
    listing_id: str
    business_id: str
    user_id: Optional[str] = None
    created_at: datetime
    
    pass

class Lead(LeadInDBBase):
    pass
