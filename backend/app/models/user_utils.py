from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Notification(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"))
    title = Column(String)
    body = Column(Text)
    type = Column(String)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")

class UserInterest(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"))
    category = Column(String)
    sub_category = Column(String, nullable=True)
    area = Column(String, nullable=True)
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)

    user = relationship("User", back_populates="interests")

class DealHunter(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"))
    label = Column(String)
    category = Column(String)
    sub_category = Column(String, nullable=True)
    area = Column(String, nullable=True)
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="deal_hunters")

class UserWallet(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"), unique=True)
    request_credits = Column(Integer, default=0)
    free_requests_used = Column(Integer, default=0)

    user = relationship("User", back_populates="wallet")

class PaymentTransaction(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"))
    amount = Column(Float)
    type = Column(String)  # credit_purchase, subscription, ad_payment
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="transactions")

class Review(Base):
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, ForeignKey("business.id"))
    user_id = Column(String, ForeignKey("user.id"))
    user_name = Column(String)
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

class Favorite(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"))
    target_id = Column(String)  # businessId or listingId
    target_type = Column(String)  # business, listing
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BusinessFavorite(Base):
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, ForeignKey("business.id"))
    user_id = Column(String, ForeignKey("user.id"))
    note = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SaleCampaign(Base):
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, ForeignKey("business.id"))
    title = Column(String)
    description = Column(Text)
    category = Column(String)
    season = Column(String)
    original_price = Column(Float)
    sale_price = Column(Float)
    discount_percent = Column(Float)
    image_url = Column(String, nullable=True)
    start_date = Column(String)
    end_date = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="sale_campaigns")
