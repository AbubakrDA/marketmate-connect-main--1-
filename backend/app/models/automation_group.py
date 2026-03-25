from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class AutomationWorkflow(Base):
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, ForeignKey("business.id"))
    name = Column(String)
    trigger_type = Column(String)  # buyer_request_received, offer_accepted, new_message
    action_type = Column(String)  # webhook, email, google_sheet, internal_log
    config_json = Column(JSON)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="automation_workflows")

class AutomationLog(Base):
    id = Column(String, primary_key=True, index=True)
    workflow_id = Column(String, ForeignKey("automationworkflow.id"))
    trigger_event = Column(Text)
    action_result = Column(String)  # success, failed
    details = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GroupDeal(Base):
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, ForeignKey("business.id"))
    title = Column(String)
    description = Column(Text)
    category = Column(String)
    city = Column(String)
    area = Column(String)
    original_price = Column(Float)
    deal_price = Column(Float)
    required_participants = Column(Integer)
    current_participants = Column(Integer, default=0)
    start_date = Column(String)
    end_date = Column(String)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="group_deals")
    participants = relationship("GroupDealParticipant", back_populates="deal")

class GroupDealParticipant(Base):
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(String, ForeignKey("groupdeal.id"))
    user_id = Column(String, ForeignKey("user.id"))
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="joined")  # joined, confirmed, cancelled

    deal = relationship("GroupDeal", back_populates="participants")
