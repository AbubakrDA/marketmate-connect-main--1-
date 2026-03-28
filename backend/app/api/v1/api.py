from fastapi import APIRouter
from app.api.v1.endpoints import auth, businesses, listings, users, leads, dashboard, payments, requests, offers

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(businesses.router, prefix="/businesses", tags=["businesses"])
api_router.include_router(listings.router, prefix="/listings", tags=["listings"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(leads.router, prefix="/leads", tags=["leads"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(requests.router, prefix="/requests", tags=["requests"])
api_router.include_router(offers.router, prefix="/offers", tags=["offers"])
