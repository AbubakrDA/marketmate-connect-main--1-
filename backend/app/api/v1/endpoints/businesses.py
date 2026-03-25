from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.business.Business])
def read_businesses(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve businesses.
    """
    businesses = crud.business.get_multi(db, skip=skip, limit=limit)
    return businesses

@router.get("/{id}", response_model=schemas.business.Business)
def read_business(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
) -> Any:
    """
    Get business by ID.
    """
    biz = crud.business.get(db, id=id)
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    return biz
