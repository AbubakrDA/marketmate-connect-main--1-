from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
from typing import Optional
import uuid

from app.models.listing_lead import Lead
from app.models.marketing_subscription import Subscription
from app.schemas.lead import LeadCreate
from app import crud

class LeadService:
    @staticmethod
    def create_lead(db: Session, lead_in: LeadCreate) -> Lead:
        # 1. Deduplication (5 minute window for same user/business)
        five_minutes_ago = datetime.utcnow() - timedelta(minutes=5)
        existing_lead = db.query(Lead).filter(
            and_(
                Lead.user_id == lead_in.user_id,
                Lead.business_id == lead_in.business_id,
                Lead.created_at >= five_minutes_ago,
                Lead.lead_type == lead_in.lead_type
            )
        ).first()

        if existing_lead:
            # Return existing lead to avoid double charging
            return existing_lead

        # 2. Check Subscription Quota
        subscription = db.query(Subscription).filter(
            Subscription.business_id == lead_in.business_id,
            Subscription.status == "active"
        ).first()

        lead_price = 0.0
        if subscription:
            if subscription.leads_remaining > 0:
                # Deduct from quota
                subscription.leads_remaining -= 1
                subscription.leads_used += 1
                lead_price = 0.0 # Covered by subscription
            else:
                # Pay-per-lead (5-10 EGP depending on plan or default)
                # For now, default to 10 EGP
                lead_price = 10.0
        else:
            # No active subscription? Maybe charge premium or block?
            # User requirement: "If user exceeds plan -> charge per lead (5-10 EGP)"
            lead_price = 10.0

        # 3. Create Lead Record
        db_obj = Lead(
            id=str(uuid.uuid4()),
            listing_id=lead_in.listing_id,
            business_id=lead_in.business_id,
            user_id=lead_in.user_id,
            name=lead_in.name,
            email=lead_in.email,
            phone=lead_in.phone,
            message=lead_in.message,
            lead_type=lead_in.lead_type,
            price=lead_price,
            status="new"
        )
        
        db.add(db_obj)
        if subscription:
            db.add(subscription)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @staticmethod
    def update_status(db: Session, lead_id: str, status: str) -> Optional[Lead]:
        db_obj = db.query(Lead).filter(Lead.id == lead_id).first()
        if db_obj:
            db_obj.status = status
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj
