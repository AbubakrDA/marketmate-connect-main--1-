from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.api import deps
from app.services.payment_service import PaymentService

router = APIRouter()

@router.post("/init", response_model=schemas.payment.Payment)
def initiate_payment(
    *,
    db: Session = Depends(deps.get_db),
    payment_in: schemas.payment.PaymentCreate,
) -> Any:
    """
    Initiate a new payment (Paymob/Fawry).
    """
    return PaymentService.init_payment(
        db, 
        user_id=payment_in.user_id,
        business_id=payment_in.business_id,
        amount=payment_in.amount,
        method=payment_in.method
    )

@router.post("/webhook")
def payment_webhook(
    *,
    db: Session = Depends(deps.get_db),
    data: dict,
) -> Any:
    """
    Webhook for payment provider callbacks.
    """
    # Simplified webhook handling logic
    external_id = data.get("id")
    status = "success" if data.get("success") == True else "failed"
    payment = PaymentService.handle_webhook(db, external_id=str(external_id), status=status)
    if not payment:
         return {"status": "ignored"}
    return {"status": "received"}
