from typing import Optional
from datetime import datetime
from .base import CamelBaseModel

class PaymentBase(CamelBaseModel):
    amount: float
    currency: str = "EGP"
    status: str = "pending"
    method: str

class PaymentCreate(PaymentBase):
    user_id: str
    business_id: Optional[str] = None
    external_id: Optional[str] = None

class PaymentUpdate(PaymentBase):
    status: str
    external_id: Optional[str] = None

class PaymentInDBBase(PaymentBase):
    id: str
    user_id: str
    business_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Payment(PaymentInDBBase):
    pass
