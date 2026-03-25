from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps

router = APIRouter()

@router.post("/", response_model=schemas.lead.Lead)
def create_lead(
    *,
    db: Session = Depends(deps.get_db),
    lead_in: schemas.lead.LeadCreate,
) -> Any:
    """
    Create new lead.
    """
    return crud.lead.create(db, obj_in=lead_in)

@router.get("/", response_model=List[schemas.lead.Lead])
def read_leads(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve leads.
    """
    return crud.lead.get_multi(db, skip=skip, limit=limit)

@router.get("/business/{business_id}", response_model=List[schemas.lead.Lead])
def read_business_leads(
    *,
    db: Session = Depends(deps.get_db),
    business_id: str,
) -> Any:
    """
    Get leads by business ID.
    """
    return crud.lead.get_by_business(db, business_id=business_id)
