from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class User(Base):
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")  # admin, business, user
    phone = Column(String)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    businesses = relationship("Business", back_populates="owner")
    wallet = relationship("UserWallet", back_populates="user", uselist=False)
    leads = relationship("Lead", back_populates="user")
    buyer_requests = relationship("BuyerRequest", back_populates="user")
    deal_hunters = relationship("DealHunter", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    interests = relationship("UserInterest", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    transactions = relationship("PaymentTransaction", back_populates="user")

class Business(Base):
    id = Column(String, primary_key=True, index=True)
    owner_user_id = Column(String, ForeignKey("user.id"))
    name = Column(String, index=True)
    category = Column(String, index=True)
    sub_category = Column(String)
    description = Column(Text)
    phone = Column(String)
    email = Column(String)
    area = Column(String, index=True)
    city = Column(String, index=True)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    logo_url = Column(String)
    verified = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="businesses")
    listings = relationship("Listing", back_populates="business")
    leads = relationship("Lead", back_populates="business")
    ads = relationship("AdCampaign", back_populates="business")
    subscription = relationship("Subscription", back_populates="business", uselist=False)
    recommendations = relationship("Recommendation", back_populates="business")
    offers = relationship("Offer", back_populates="business")
    sale_campaigns = relationship("SaleCampaign", back_populates="business")
    reviews = relationship("Review", back_populates="business")
    automation_workflows = relationship("AutomationWorkflow", back_populates="business")
    group_deals = relationship("GroupDeal", back_populates="business")
