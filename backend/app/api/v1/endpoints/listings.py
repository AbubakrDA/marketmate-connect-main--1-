from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.listing.Listing])
def read_listings(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve listings.
    """
    listings = crud.listing.get_multi(db, skip=skip, limit=limit)
    return listings

@router.get("/{id}", response_model=schemas.listing.Listing)
def read_listing(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
) -> Any:
    """
    Get listing by ID.
    """
    lst = crud.listing.get(db, id=id)
    if not lst:
        raise HTTPException(status_code=404, detail="Listing not found")
    return lst

@router.get("/business/{business_id}", response_model=List[schemas.listing.Listing])
def read_business_listings(
    *,
    db: Session = Depends(deps.get_db),
    business_id: str,
) -> Any:
    """
    Get listings by business.
    """
    return crud.listing.get_by_business(db, business_id=business_id)
