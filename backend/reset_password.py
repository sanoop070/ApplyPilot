from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.repositories.user_repository import user_repository


EMAIL = "demo3@applypilot.com"
NEW_PASSWORD = "ApplyPilot123!"


db: Session = SessionLocal()

try:
    user = user_repository.get_by_email(db, EMAIL)

    if user is None:
        print(f"User {EMAIL} was not found.")
    else:
        user.hashed_password = hash_password(NEW_PASSWORD)
        db.commit()

        print("Password reset successfully.")
        print(f"Email: {EMAIL}")
        print(f"New password: {NEW_PASSWORD}")

finally:
    db.close()
