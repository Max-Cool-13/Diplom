from fastapi import FastAPI, Depends, HTTPException, APIRouter, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from app import models, schemas, auth, crud
from app.database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/register/", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_user(db=db, user=user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login/", response_model=schemas.Token)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.patch("/users/me", response_model=schemas.UserOut)
def update_profile(
    updates: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.update_user(db=db, db_user=current_user, updates=updates)

@app.get("/users/", response_model=List[schemas.UserOut])
def get_all_users(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    users = db.query(models.User).all()
    return users

@app.get("/services/", response_model=List[schemas.ServiceOut])
def get_services(db: Session = Depends(get_db)):
    return crud.get_all_services(db=db)

@app.post("/services/", response_model=schemas.ServiceOut)
def create_service(
    service: schemas.ServiceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    return crud.create_service(db=db, service=service)

@app.delete("/services/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    service = crud.delete_service(db=db, service_id=service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"detail": "Service deleted"}

@app.post("/appointments/", response_model=schemas.AppointmentOut)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    service = crud.get_service_by_id(db=db, service_id=appointment.service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return crud.create_appointment(db=db, appointment=appointment, user_id=current_user.id)

@app.get("/appointments/", response_model=List[schemas.AppointmentOut])
def get_user_appointments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_user_appointments(db=db, user_id=current_user.id)

@app.get("/appointments/history/", response_model=List[schemas.AppointmentWithService])
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_user_appointments(db=db, user_id=current_user.id)

@app.get("/users/me", response_model=schemas.UserOut)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/services/{service_id}", response_model=schemas.ServiceOut)
def get_service_by_id(service_id: int, db: Session = Depends(get_db)):
    service = crud.get_service_by_id(db=db, service_id=service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service
