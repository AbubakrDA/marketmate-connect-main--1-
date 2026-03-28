from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps
import uuid

router = APIRouter()

@router.get("/", response_model=List[schemas.communication.BuyerRequest])
def read_requests(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category: str = None
) -> Any:
    """
    Retrieve buyer requests.
    """
    query = db.query(models.transaction_communication.BuyerRequest)
    if category:
        query = query.filter(models.transaction_communication.BuyerRequest.category == category)
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.communication.BuyerRequest)
def create_request(
    *,
    db: Session = Depends(deps.get_db),
    request_in: schemas.communication.BuyerRequestCreate,
) -> Any:
    """
    Create new buyer request.
    """
    db_obj = models.transaction_communication.BuyerRequest(
        id=str(uuid.uuid4()),
        **request_in.dict()
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/user/{user_id}", response_model=List[schemas.communication.BuyerRequest])
def read_user_requests(
    user_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get requests by user ID.
    """
    return db.query(models.transaction_communication.BuyerRequest).filter(
        models.transaction_communication.BuyerRequest.user_id == user_id
    ).all()
