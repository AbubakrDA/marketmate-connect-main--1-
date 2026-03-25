from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, JSON, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class BuyerRequest(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"))
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    sub_category = Column(String, nullable=True)
    city = Column(String, index=True)
    area = Column(String, index=True)
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)
    date_needed = Column(String, nullable=True)
    status = Column(String, default="open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="buyer_requests")
    offers = relationship("Offer", back_populates="request")

class Offer(Base):
    id = Column(String, primary_key=True, index=True)
    request_id = Column(String, ForeignKey("buyerrequest.id"))
    business_id = Column(String, ForeignKey("business.id"))
    offer_title = Column(String)
    offer_message = Column(Text)
    offer_price = Column(Float)
    listing_reference = Column(String, nullable=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    request = relationship("BuyerRequest", back_populates="offers")
    business = relationship("Business", back_populates="offers")

# Association table for conversation participants
conversation_participants = Table(
    "conversation_participants",
    Base.metadata,
    Column("conversation_id", String, ForeignKey("conversation.id"), primary_key=True),
    Column("user_id", String, ForeignKey("user.id"), primary_key=True),
)

class Conversation(Base):
    id = Column(String, primary_key=True, index=True)
    request_id = Column(String, ForeignKey("buyerrequest.id"), nullable=True)
    offer_id = Column(String, ForeignKey("offer.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    participants = relationship("User", secondary=conversation_participants)
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, ForeignKey("conversation.id"))
    sender_id = Column(String, ForeignKey("user.id"))
    text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")
