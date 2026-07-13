from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserCreate
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# -----------------------------
# Password Change Schema
# -----------------------------
class PasswordChange(BaseModel):
    old_password: str
    new_password: str


# -----------------------------
# Register User
# -----------------------------
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        role="customer"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registration Successful",
        "user": {
            "id": new_user.id,
            "name": new_user.full_name,
            "email": new_user.email,
            "role": new_user.role
        }
    }


# -----------------------------
# Login
# -----------------------------
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    existing = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        form_data.password,
        existing.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Wrong password"
        )

    access_token = create_access_token(
        data={
            "sub": existing.email,
            "user_id": existing.id,
            "role": existing.role
        }
    )

    return {
        "message": "Login Successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": existing.id,
            "name": existing.full_name,
            "email": existing.email,
            "role": existing.role
        }
    }


# -----------------------------
# Get Logged-in User Profile
# -----------------------------
@router.get("/profile")
def get_profile(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role
    }


# -----------------------------
# Change Password
# -----------------------------
@router.put("/change-password")
def change_password(
    passwords: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if not verify_password(
        passwords.old_password,
        current_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect"
        )

    current_user.password = hash_password(
        passwords.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }