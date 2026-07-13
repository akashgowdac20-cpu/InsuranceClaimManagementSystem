import os
import shutil

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)

from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph
)

from reportlab.lib.styles import getSampleStyleSheet
from openpyxl import Workbook
from fastapi.responses import FileResponse

from app.database import get_db
from app.models import Claim, User
from app.auth import get_current_user

router = APIRouter(
    prefix="/claims",
    tags=["Claims"]
)

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# -----------------------------
# Create Claim
# -----------------------------
@router.post("/")
def create_claim(
    title: str = Form(...),
    description: str = Form(...),
    claim_amount: float = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    image_path = None

    if image:

        filename = image.filename

        save_path = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(
                image.file,
                buffer
            )

        image_path = filename

    new_claim = Claim(
        title=title,
        description=description,
        claim_amount=claim_amount,
        status="Pending",
        image=image_path,
        user_id=current_user.id
    )

    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)

    return {
        "message": "Claim Created Successfully",
        "claim": new_claim
    }


# -----------------------------
# Get My Claims
# -----------------------------
@router.get("/")
def get_my_claims(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return db.query(
        Claim
    ).filter(
        Claim.user_id == current_user.id
    ).all()


# -----------------------------
# Get Single Claim
# -----------------------------
@router.get("/{claim_id}")
def get_claim(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    claim = db.query(
        Claim
    ).filter(
        Claim.id == claim_id,
        Claim.user_id == current_user.id
    ).first()

    if not claim:

        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    return claim


# -----------------------------
# Update Claim
# -----------------------------
@router.put("/{claim_id}")
def update_claim(
    claim_id: int,
    title: str = Form(...),
    description: str = Form(...),
    claim_amount: float = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    claim = db.query(
        Claim
    ).filter(
        Claim.id == claim_id,
        Claim.user_id == current_user.id
    ).first()

    if not claim:

        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    claim.title = title
    claim.description = description
    claim.claim_amount = claim_amount

    if image:

        filename = image.filename

        save_path = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(
                image.file,
                buffer
            )

        claim.image = filename

    db.commit()
    db.refresh(claim)

    return {
        "message": "Claim Updated Successfully",
        "claim": claim
    }


# -----------------------------
# Update Status
# -----------------------------
@router.put("/{claim_id}/status")
def update_claim_status(
    claim_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Only admin can update claim status."
        )

    claim = db.query(
        Claim
    ).filter(
        Claim.id == claim_id
    ).first()

    if not claim:

        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    if status not in [
        "Pending",
        "Approved",
        "Rejected"
    ]:

        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    claim.status = status

    db.commit()
    db.refresh(claim)

    return {
        "message": "Status Updated Successfully"
    }


# -----------------------------
# Delete Claim
# -----------------------------
@router.delete("/{claim_id}")
def delete_claim(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    claim = db.query(
        Claim
    ).filter(
        Claim.id == claim_id,
        Claim.user_id == current_user.id
    ).first()

    if not claim:

        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    db.delete(claim)
    db.commit()

    return {
        "message": "Claim Deleted Successfully"
    }
# -----------------------------
# Dashboard Stats
# -----------------------------
@router.get("/dashboard/stats")
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return {
        "Total Claims": db.query(Claim).filter(
            Claim.user_id == current_user.id
        ).count(),

        "Pending Claims": db.query(Claim).filter(
            Claim.user_id == current_user.id,
            Claim.status == "Pending"
        ).count(),

        "Approved Claims": db.query(Claim).filter(
            Claim.user_id == current_user.id,
            Claim.status == "Approved"
        ).count(),

        "Rejected Claims": db.query(Claim).filter(
            Claim.user_id == current_user.id,
            Claim.status == "Rejected"
        ).count()
    }


# -----------------------------
# Admin - All Claims
# -----------------------------
@router.get("/admin/all")
def get_all_claims(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    claims = db.query(Claim).all()

    result = []

    for claim in claims:

        result.append({
            "id": claim.id,
            "title": claim.title,
            "description": claim.description,
            "claim_amount": claim.claim_amount,
            "status": claim.status,
            "image": claim.image,
            "created_at": claim.created_at,
            "customer": claim.user.full_name,
            "email": claim.user.email
        })

    return result


# -----------------------------
# Download Claim PDF
# -----------------------------
@router.get("/{claim_id}/pdf")
def download_claim_pdf(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Admin can download any claim
    if current_user.role == "admin":

        claim = db.query(Claim).filter(
            Claim.id == claim_id
        ).first()

    # Customer can download only their own claim
    else:

        claim = db.query(Claim).filter(
            Claim.id == claim_id,
            Claim.user_id == current_user.id
        ).first()

    if not claim:

        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    filename = f"claim_{claim.id}.pdf"

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    story = []

    story.append(
        Paragraph(
            "<b><font size='18'>Insurance Claim Report</font></b>",
            styles["Title"]
        )
    )

    story.append(Paragraph("<br/><br/>", styles["Normal"]))

    story.append(
        Paragraph(f"<b>Claim ID:</b> {claim.id}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Customer:</b> {claim.user.full_name}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Email:</b> {claim.user.email}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Title:</b> {claim.title}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Description:</b> {claim.description}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Claim Amount:</b> ₹ {claim.claim_amount}", styles["Normal"])
    )

    story.append(
        Paragraph(f"<b>Status:</b> {claim.status}", styles["Normal"])
    )

    if claim.created_at:

        story.append(
            Paragraph(
                f"<b>Created On:</b> {claim.created_at.strftime('%d-%m-%Y %H:%M')}",
                styles["Normal"]
            )
        )

    if claim.image:

        story.append(
            Paragraph(
                f"<b>Uploaded Image:</b> {claim.image}",
                styles["Normal"]
            )
        )

    story.append(Paragraph("<br/><br/>", styles["Normal"]))

    story.append(
        Paragraph(
            "Generated by Insurance Claim Management System",
            styles["Italic"]
        )
    )

    doc.build(story)

    return FileResponse(
        path=filename,
        media_type="application/pdf",
        filename=filename
    )
# -----------------------------
# Admin - Export All Claims Excel
# -----------------------------
@router.get("/admin/export")
def export_all_claims_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    claims = db.query(Claim).all()

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Insurance Claims"

    sheet.append([
        "ID",
        "Customer",
        "Email",
        "Title",
        "Description",
        "Amount",
        "Status",
        "Created On"
    ])

    for claim in claims:

        sheet.append([
            claim.id,
            claim.user.full_name,
            claim.user.email,
            claim.title,
            claim.description,
            claim.claim_amount,
            claim.status,
            claim.created_at.strftime("%d/%m/%Y %I:%M %p")
            if claim.created_at else ""
        ])
        filename = "All_Insurance_Claims.xlsx"

        workbook.save(filename)

        return FileResponse(
            path=filename,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename=filename
        )