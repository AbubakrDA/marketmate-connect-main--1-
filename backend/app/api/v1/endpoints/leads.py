from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.lead_service import LeadService
from app import schemas
from app.api import deps

router = APIRouter()

@router.post("/", response_model=schemas.lead.Lead)
def create_lead(
    *,
    db: Session = Depends(deps.get_db),
    lead_in: schemas.lead.LeadCreate,
) -> Any:
    """
    Create new lead using LeadService (handles deduplication and quotas).
    """
    return LeadService.create_lead(db, lead_in=lead_in)

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

@router.put("/{id}/status", response_model=schemas.lead.Lead)
def update_lead_status(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    status: str,
) -> Any:
    """
    Update lead status (new -> contacted -> closed).
    """
    lead = LeadService.update_status(db, lead_id=id, status=status)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.get("/business/{business_id}", response_model=List[schemas.lead.Lead])
def read_business_leads(
    *,
    db: Session = Depends(deps.get_db),
    business_id: str,
) -> Any:
    """
    Get leads by business ID.
    """
    from app import crud
    return crud.lead.get_by_business(db, business_id=business_id)
