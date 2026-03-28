from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from app.api import deps
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/admin/stats")
def get_admin_stats(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get global stats for admin dashboard.
    """
    user_count = db.query(models.user_business.User).count()
    business_count = db.query(models.user_business.Business).count()
    listing_count = db.query(models.user_business.Listing).count()
    lead_count = db.query(models.listing_lead.Lead).count()
    request_count = db.query(models.transaction_communication.BuyerRequest).count()
    offer_count = db.query(models.transaction_communication.Offer).count()
    
    total_revenue_old = db.query(func.sum(models.user_utils.PaymentTransaction.amount)).scalar() or 0
    total_revenue_new = db.query(func.sum(models.payment.Payment.amount)).filter(models.payment.Payment.status == "success").scalar() or 0
    total_revenue = total_revenue_old + total_revenue_new
    pro_subs = db.query(models.marketing_subscription.Subscription).filter(
        models.marketing_subscription.Subscription.plan_name == "pro",
        models.marketing_subscription.Subscription.status == "active"
    ).count()
    
    # Invitation stats
    inv_total = db.query(models.marketing_subscription.BusinessInvitation).count()
    inv_sent = db.query(models.marketing_subscription.BusinessInvitation).filter(models.marketing_subscription.BusinessInvitation.status == "sent").count()
    inv_opened = db.query(models.marketing_subscription.BusinessInvitation).filter(models.marketing_subscription.BusinessInvitation.status == "opened").count()
    inv_joined = db.query(models.marketing_subscription.BusinessInvitation).filter(models.marketing_subscription.BusinessInvitation.status == "joined").count()
    
    # Category distribution
    cat_counts = db.query(
        models.user_business.Listing.category, 
        func.count(models.user_business.Listing.id)
    ).group_by(models.user_business.Listing.category).all()
    
    category_data = [{"name": cat, "value": count} for cat, count in cat_counts]
    
    # Mock some time-series data for the chart since real history might be thin in seed
    # In a real app, we'd group by date
    leads_by_month = [
        {"month": "Jan", "leads": 2, "requests": 1},
        {"month": "Feb", "leads": 4, "requests": 3},
        {"month": "Mar", "leads": lead_count, "requests": request_count},
    ]
    
    return {
        "counts": {
            "users": user_count,
            "businesses": business_count,
            "listings": listing_count,
            "leads": lead_count,
            "requests": request_count,
            "offers": offer_count,
        },
        "revenue": {
            "total": total_revenue,
            "pro_subscriptions": pro_subs,
        },
        "invitations": {
            "total": inv_total,
            "sent": inv_sent,
            "opened": inv_opened,
            "joined": inv_joined,
        },
        "category_distribution": category_data,
        "time_series": leads_by_month
    }

@router.get("/business/{business_id}/stats")
def get_business_stats(
    business_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get stats for a specific business dashboard.
    """
    listing_count = db.query(models.user_business.Listing).filter(models.user_business.Listing.business_id == business_id).count()
    lead_count = db.query(models.listing_lead.Lead).filter(models.listing_lead.Lead.business_id == business_id).count()
    offer_count = db.query(models.transaction_communication.Offer).filter(models.transaction_communication.Offer.business_id == business_id).count()
    
    business = db.query(models.user_business.Business).filter(models.user_business.Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    return {
        "counts": {
            "listings": listing_count,
            "leads": lead_count,
            "offers": offer_count,
        },
        "rating": business.rating,
        "review_count": business.review_count,
        "leads": {
            "total": lead_count,
            "new": db.query(models.listing_lead.Lead).filter(models.listing_lead.Lead.business_id == business_id, models.listing_lead.Lead.status == "new").count(),
            "contacted": db.query(models.listing_lead.Lead).filter(models.listing_lead.Lead.business_id == business_id, models.listing_lead.Lead.status == "contacted").count(),
            "closed": db.query(models.listing_lead.Lead).filter(models.listing_lead.Lead.business_id == business_id, models.listing_lead.Lead.status == "closed").count(),
        },
        "subscription": {
            "plan": business.subscription.plan_name if business.subscription else "none",
            "leads_used": business.subscription.leads_used if business.subscription else 0,
            "leads_remaining": business.subscription.leads_remaining if business.subscription else 0,
            "status": business.subscription.status if business.subscription else "none",
        } if business.subscription else None
    }
