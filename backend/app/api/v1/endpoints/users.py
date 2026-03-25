from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps

router = APIRouter()

@router.get("/me", response_model=schemas.user.User)
def read_user_me(
    db: Session = Depends(deps.get_db),
    # current_user: models.user_business.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user. (Simplified for MVP, usually uses JWT)
    """
    # For now, return the first user as 'me' if no auth logic is fully wired in deps
    user = db.query(models.user_business.User).first()
    return user
