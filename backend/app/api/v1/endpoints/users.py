from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.user.User])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve users. (Admin only in production)
    """
    users = crud.user.get_multi(db, skip=skip, limit=limit)
    return users

@router.get("/me", response_model=schemas.user.User)
def read_user_me(
    db: Session = Depends(deps.get_db),
    # current_user: models.user_business.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    # Simplified for MVP: return the first user if logic is not fully wired
    user = db.query(models.user_business.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{id}", response_model=schemas.user.User)
def read_user(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
) -> Any:
    """
    Get user by ID.
    """
    user = crud.user.get(db, id=id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
