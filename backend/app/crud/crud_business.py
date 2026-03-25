from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.user_business import Business
from app.schemas.business import BusinessCreate, BusinessUpdate

class CRUDBusiness:
    def get(self, db: Session, id: str) -> Optional[Business]:
        return db.query(Business).filter(Business.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Business]:
        return db.query(Business).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: BusinessCreate) -> Business:
        db_obj = Business(**obj_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Business, obj_in: BusinessUpdate) -> Business:
        update_data = obj_in.dict(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: str) -> Business:
        obj = db.query(Business).get(id)
        db.delete(obj)
        db.commit()
        return obj

business = CRUDBusiness()
