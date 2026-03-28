from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Payment(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"))
    business_id = Column(String, ForeignKey("business.id"), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="EGP")
    status = Column(String, default="pending")  # pending, success, failed
    method = Column(String)  # paymob, fawry, wallet
    external_id = Column(String, nullable=True)  # reference ID from provider
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="transactions")
