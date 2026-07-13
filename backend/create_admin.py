from app.database import SessionLocal
from app.models import User
from app.auth import hash_password

db = SessionLocal()

existing = db.query(User).filter(
    User.email == "admin@example.com"
).first()

if existing:
    print("Admin already exists")
else:
    admin = User(
        full_name="Administrator",
        email="admin@example.com",
        password=hash_password("admin123"),
        role="admin"
    )

    db.add(admin)
    db.commit()

    print("Admin created successfully")

db.close()