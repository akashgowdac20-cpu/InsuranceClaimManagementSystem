from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.routers import users, claims

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Insurance Claim Management System")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://insurance-claim-management-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# Register routers
app.include_router(users.router)
app.include_router(claims.router)


@app.get("/")
def root():
    return {
        "message": "Insurance Claim Management API Running"
    }