from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class AdCampaign(Base):
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, ForeignKey("business.id"))
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    content_type = Column(String, nullable=True)  # image, video, text
    image_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    call_to_action = Column(String, nullable=True)
    link_url = Column(String, nullable=True)
    budget_egp = Column(Float)
    status = Column(String, default="active")
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="ads")

class Subscription(Base):
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, ForeignKey("business.id"), unique=True)
    plan_name = Column(String)  # free, pro
    monthly_price_egp = Column(Float)
    status = Column(String, default="active")
    start_date = Column(String)
    end_date = Column(String)

    business = relationship("Business", back_populates="subscription")

class Recommendation(Base):
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, ForeignKey("business.id"), nullable=True)
    user_id = Column(String, ForeignKey("user.id"), nullable=True)
    type = Column(String)  # pricing, area, improvement, promotion, listing
    title = Column(String)
    description = Column(Text)
    score = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="recommendations")

class SpecialOffer(Base):
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, ForeignKey("business.id"))
    target_user_ids = Column(JSON)  # List of user IDs
    title = Column(String)
    message = Column(Text)
    discount_percent = Column(Float)
    listing_id = Column(String, ForeignKey("listing.id"), nullable=True)
    expires_at = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MarketDemandStat(Base):
    id = Column(String, primary_key=True, index=True)
    category = Column(String, index=True)
    sub_category = Column(String, nullable=True)
    city = Column(String)
    area = Column(String)
    request_count = Column(Integer)
    average_price = Column(Float)
    month = Column(Integer)
    year = Column(Integer)

class DirectoryBusiness(Base):
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    sub_category = Column(String, nullable=True)
    city = Column(String)
    area = Column(String)
    phone = Column(String)
    email = Column(String)
    source = Column(String)
    is_registered = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BusinessInvitation(Base):
    id = Column(String, primary_key=True, index=True)
    directory_business_id = Column(String, ForeignKey("directorybusiness.id"))
    request_id = Column(String, ForeignKey("buyerrequest.id"), nullable=True)
    message = Column(Text)
    status = Column(String, default="sent")  # sent, opened, joined
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    opened_at = Column(DateTime(timezone=True), nullable=True)
    joined_at = Column(DateTime(timezone=True), nullable=True)

class AIInsight(Base):
    id = Column(String, primary_key=True, index=True)
    type = Column(String)  # business_performance, market_trend, pricing, demand, competitor
    title = Column(String)
    summary = Column(Text)
    details = Column(Text)
    impact = Column(String)  # high, medium, low
    category = Column(String, nullable=True)
    metric = Column(String, nullable=True)
    metric_value = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
