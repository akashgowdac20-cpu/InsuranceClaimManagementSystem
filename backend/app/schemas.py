from typing import Optional
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ClaimCreate(BaseModel):
    title: str
    description: str
    claim_amount: float


class ClaimResponse(BaseModel):
    id: int
    title: str
    description: str
    claim_amount: float
    status: str
    image: Optional[str] = None

    class Config:
        orm_mode = True