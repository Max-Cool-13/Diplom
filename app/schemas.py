from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    model_config = {
        "from_attributes": True
    }

class Token(BaseModel):
    access_token: str
    token_type: str

class ServiceCreate(BaseModel):
    name: str
    description: str
    price: int

class ServiceOut(BaseModel):
    id: int
    name: str
    description: str
    price: int

    model_config = {
        "from_attributes": True
    }

class AppointmentCreate(BaseModel):
    service_id: int
    appointment_time: datetime

class AppointmentOut(BaseModel):
    id: int
    service_id: int
    appointment_time: datetime

    model_config = {
        "from_attributes": True
    }

class AppointmentWithService(BaseModel):
    id: int
    appointment_time: datetime
    service: ServiceOut

    model_config = {
        "from_attributes": True
    }