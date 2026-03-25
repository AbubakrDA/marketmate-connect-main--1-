import json
from sqlalchemy.orm import Session
from app.db import base
from app import crud, models, schemas
from app.db.session import SessionLocal, engine
from app.core.security import get_password_hash

# Mock data extracted from mock.ts
USERS = [
    {"id": "u1", "name": "Admin User", "email": "admin@marketmate.eg", "password": "admin123", "role": "admin", "phone": "+201000000000"},
    {"id": "u2", "name": "Ahmed Hassan", "email": "ahmed@example.com", "password": "user123", "role": "user", "phone": "+201111111111"},
    {"id": "u3", "name": "Dr. Sarah Mostafa", "email": "sarah@clinic.eg", "password": "business123", "role": "business", "phone": "+201222222222"},
    {"id": "u4", "name": "Omar El-Sayed", "email": "omar@realestate.eg", "password": "business123", "role": "business", "phone": "+201333333333"},
    {"id": "u5", "name": "Fatima Nour", "email": "fatima@fashion.eg", "password": "business123", "role": "business", "phone": "+201444444444"},
]

BUSINESSES = [
    {
        "id": "b1", "ownerUserId": "u3", "name": "Cairo Medical Center", "category": "Clinics", "subCategory": "General Practice",
        "description": "Leading medical center in Maadi providing comprehensive healthcare services.",
        "phone": "+201222222222", "email": "info@cairomedical.eg", "area": "Maadi", "city": "Cairo",
        "address": "15 Road 9, Maadi, Cairo", "latitude": 29.9602, "longitude": 31.2569,
        "logoUrl": "https://ui-avatars.com/api/?name=Cairo+Medical&background=1e40af&color=fff&size=128&bold=true",
        "verified": True, "rating": 4.8, "reviewCount": 47
    },
    {
        "id": "b2", "ownerUserId": "u4", "name": "Nile View Properties", "category": "Real Estate", "subCategory": "Apartments",
        "description": "Premium real estate agency specializing in luxury apartments.",
        "phone": "+201333333333", "email": "info@nileview.eg", "area": "Zamalek", "city": "Cairo",
        "address": "8 Mohamed Mazhar St, Zamalek, Cairo", "latitude": 30.0588, "longitude": 31.2196,
        "logoUrl": "https://ui-avatars.com/api/?name=Nile+View&background=059669&color=fff&size=128&bold=true",
        "verified": True, "rating": 4.6, "reviewCount": 32
    },
]

LISTINGS = [
    {"id": "l1", "businessId": "b1", "title": "General Health Checkup", "description": "Comprehensive health screening.", "category": "Clinics", "subCategory": "General Practice", "area": "Maadi", "city": "Cairo", "priceEgp": 500, "imageUrl": "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop"},
    {"id": "l5", "businessId": "b2", "title": "3-Bedroom Apartment in Zamalek", "description": "Stunning Nile view apartment.", "category": "Real Estate", "subCategory": "Apartments", "area": "Zamalek", "city": "Cairo", "priceEgp": 25000, "imageUrl": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"},
]

def init_db(db: Session) -> None:
    # Create Users
    for user_data in USERS:
        user = crud.user.get(db, id=user_data["id"])
        if not user:
            user_in = schemas.user.UserCreate(
                id=user_data["id"],
                email=user_data["email"],
                password=user_data["password"],
                name=user_data["name"],
                role=user_data["role"],
                phone=user_data["phone"]
            )
            crud.user.create(db, obj_in=user_in)

    # Create Businesses
    for biz_data in BUSINESSES:
        biz = crud.business.get(db, id=biz_data["id"])
        if not biz:
            biz_in = schemas.business.BusinessCreate(
                id=biz_data["id"],
                owner_user_id=biz_data["ownerUserId"],
                name=biz_data["name"],
                category=biz_data["category"],
                sub_category=biz_data["subCategory"],
                description=biz_data["description"],
                phone=biz_data["phone"],
                email=biz_data["email"],
                area=biz_data["area"],
                city=biz_data["city"],
                address=biz_data["address"],
                latitude=biz_data["latitude"],
                longitude=biz_data["longitude"],
                logo_url=biz_data["logoUrl"],
                verified=biz_data["verified"]
            )
            crud.business.create(db, obj_in=biz_in)

    # Create Listings
    for list_data in LISTINGS:
        lst = crud.listing.get(db, id=list_data["id"])
        if not lst:
            list_in = schemas.listing.ListingCreate(
                id=list_data["id"],
                business_id=list_data["businessId"],
                title=list_data["title"],
                description=list_data["description"],
                category=list_data["category"],
                sub_category=list_data["subCategory"],
                area=list_data["area"],
                city=list_data["city"],
                price_egp=list_data["priceEgp"],
                image_url=list_data["imageUrl"]
            )
            crud.listing.create(db, obj_in=list_in)

if __name__ == "__main__":
    print("Creating tables...")
    base.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    init_db(db)
    print("Database seeded!")
