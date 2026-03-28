from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps
import uuid

router = APIRouter()

@router.get("/", response_model=List[schemas.communication.Offer])
def read_offers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve offers.
    """
    return db.query(models.transaction_communication.Offer).offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.communication.Offer)
def create_offer(
    *,
    db: Session = Depends(deps.get_db),
    offer_in: schemas.communication.OfferCreate,
) -> Any:
    """
    Create new offer.
    """
    db_obj = models.transaction_communication.Offer(
        id=str(uuid.uuid4()),
        **offer_in.dict()
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/business/{business_id}", response_model=List[schemas.communication.Offer])
def read_business_offers(
    business_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get offers by business ID.
    """
    return db.query(models.transaction_communication.Offer).filter(
        models.transaction_communication.Offer.business_id == business_id
    ).all()

@router.get("/request/{request_id}", response_model=List[schemas.communication.Offer])
def read_request_offers(
    request_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get offers for a specific buyer request.
    """
    return db.query(models.transaction_communication.Offer).filter(
        models.transaction_communication.Offer.request_id == request_id
    ).all()
