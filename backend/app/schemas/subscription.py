from typing import Optional
from datetime import datetime
from .base import CamelBaseModel

class SubscriptionBase(CamelBaseModel):
    plan_name: str
    monthly_price_egp: float
    status: str = "active"
    leads_used: int = 0
    leads_remaining: int = 0

class SubscriptionCreate(SubscriptionBase):
    business_id: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class SubscriptionUpdate(SubscriptionBase):
    plan_name: Optional[str] = None
    leads_used: Optional[int] = None
    leads_remaining: Optional[int] = None
    status: Optional[str] = None
    end_date: Optional[datetime] = None

class SubscriptionInDBBase(SubscriptionBase):
    id: str
    business_id: str
    start_date: datetime
    end_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class Subscription(SubscriptionInDBBase):
    pass
