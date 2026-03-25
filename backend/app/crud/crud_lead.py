from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.listing_lead import Lead
from app.schemas.lead import LeadCreate, LeadUpdate

class CRUDLead:
    def get(self, db: Session, id: str) -> Optional[Lead]:
        return db.query(Lead).filter(Lead.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Lead]:
        return db.query(Lead).offset(skip).limit(limit).all()

    def get_by_business(self, db: Session, *, business_id: str) -> List[Lead]:
        return db.query(Lead).filter(Lead.business_id == business_id).all()

    def create(self, db: Session, *, obj_in: LeadCreate) -> Lead:
        db_obj = Lead(**obj_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Lead, obj_in: LeadUpdate) -> Lead:
        update_data = obj_in.dict(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

lead = CRUDLead()
