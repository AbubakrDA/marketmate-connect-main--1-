from sqlalchemy.orm import Session
from typing import Optional
import uuid

from app.models.payment import Payment

class PaymentService:
    @staticmethod
    def init_payment(db: Session, user_id: str, business_id: Optional[str], amount: float, method: str) -> Payment:
        # Create Internal Payment Record
        db_obj = Payment(
            id=str(uuid.uuid4()),
            user_id=user_id,
            business_id=business_id,
            amount=amount,
            status="pending",
            method=method,
            currency="EGP"
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Here we would call the Paymob/Fawry API to get the external transaction ID/URL
        # payment_url, external_id = call_paymob_api(amount, method, ...)
        # db_obj.external_id = external_id
        # db.add(db_obj)
        # db.commit()
        
        return db_obj

    @staticmethod
    def handle_webhook(db: Session, external_id: str, status: str) -> Optional[Payment]:
        # Log and update the payment status from provider callback
        db_obj = db.query(Payment).filter(Payment.external_id == external_id).first()
        if db_obj:
            db_obj.status = status # "success" or "failed"
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj
