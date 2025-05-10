from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas
from app.auth import get_password_hash

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    is_first_user = db.query(models.User).count() == 0

    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        role=models.UserRole.admin if is_first_user else models.UserRole.client
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise ValueError("Email уже зарегистрирован")
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_all_services(db: Session):
    return db.query(models.Service).all()

def get_service_by_id(db: Session, service_id: int):
    return db.query(models.Service).filter(models.Service.id == service_id).first()

def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.Service(name=service.name, description=service.description, price=service.price)
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

def create_appointment(db: Session, appointment: schemas.AppointmentCreate, user_id: int):
    db_appointment = models.Appointment(
        user_id=user_id,
        service_id=appointment.service_id,
        appointment_time=appointment.appointment_time
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def get_user_appointments(db: Session, user_id: int):
    return db.query(models.Appointment).filter(models.Appointment.user_id == user_id).all()

def update_user(db: Session, db_user: models.User, updates: schemas.UserUpdate):
    if updates.username:
        db_user.username = updates.username
    if updates.email:
        db_user.email = updates.email
    if updates.password:
        db_user.password = get_password_hash(updates.password)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_service(db: Session, service_id: int):
    service = get_service_by_id(db, service_id)
    if not service:
        return None
    db.delete(service)
    db.commit()
    return service