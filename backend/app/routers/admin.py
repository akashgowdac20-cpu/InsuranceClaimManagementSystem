from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Claim

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# -------------------------
# Get all users
# -------------------------
@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()

    return {
        "Total Users": len(users),
        "Users": users
    }


# -------------------------
# Get all claims
# -------------------------
@router.get("/claims")
def get_all_claims(db: Session = Depends(get_db)):
    claims = db.query(Claim).all()

    return {
        "Total Claims": len(claims),
        "Claims": claims
    }


# -------------------------
# Approve claim
# -------------------------
@router.put("/claims/{claim_id}/approve")
def approve_claim(claim_id: int, db: Session = Depends(get_db)):

    claim = db.query(Claim).filter(Claim.id == claim_id).first()

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    claim.status = "Approved"

    db.commit()
    db.refresh(claim)

    return {
        "message": "Claim Approved Successfully",
        "claim": claim
    }


# -------------------------
# Reject claim
# -------------------------
@router.put("/claims/{claim_id}/reject")
def reject_claim(claim_id: int, db: Session = Depends(get_db)):

    claim = db.query(Claim).filter(Claim.id == claim_id).first()

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    claim.status = "Rejected"

    db.commit()
    db.refresh(claim)

    return {
        "message": "Claim Rejected Successfully",
        "claim": claim
    }