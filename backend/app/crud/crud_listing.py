from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.listing_lead import Listing
from app.schemas.listing import ListingCreate, ListingUpdate

class CRUDListing:
    def get(self, db: Session, id: str) -> Optional[Listing]:
        return db.query(Listing).filter(Listing.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Listing]:
        return db.query(Listing).offset(skip).limit(limit).all()

    def get_by_business(self, db: Session, *, business_id: str) -> List[Listing]:
        return db.query(Listing).filter(Listing.business_id == business_id).all()

    def create(self, db: Session, *, obj_in: ListingCreate) -> Listing:
        db_obj = Listing(**obj_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Listing, obj_in: ListingUpdate) -> Listing:
        update_data = obj_in.dict(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: str) -> Listing:
        obj = db.query(Listing).get(id)
        db.delete(obj)
        db.commit()
        return obj

listing = CRUDListing()
