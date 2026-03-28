from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Listing(Base):
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, ForeignKey("business.id"))
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    sub_category = Column(String)
    area = Column(String, index=True)
    city = Column(String, index=True)
    price_egp = Column(Float)
    old_price_egp = Column(Float, nullable=True)
    deal_label = Column(String, nullable=True)
    image_url = Column(String)
    images = Column(JSON, nullable=True)
    video_url = Column(String, nullable=True)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="listings")
    leads = relationship("Lead", back_populates="listing")

class Lead(Base):
    id = Column(String, primary_key=True, index=True)
    listing_id = Column(String, ForeignKey("listing.id"))
    business_id = Column(String, ForeignKey("business.id"))
    user_id = Column(String, ForeignKey("user.id"), nullable=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    message = Column(Text)
    lead_type = Column(String, default="whatsapp")  # whatsapp, call, message
    price = Column(Float, default=0.0)
    status = Column(String, default="new")  # new, contacted, closed
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    listing = relationship("Listing", back_populates="leads")
    business = relationship("Business", back_populates="leads")
    user = relationship("User", back_populates="leads")
