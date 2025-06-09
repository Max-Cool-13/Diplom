from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models import UserRole, AppointmentStatus

# Схема для создания нового пользователя
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[UserRole] = UserRole.client

# Схема для обновления данных пользователя
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

# Схема для вывода информации о пользователе
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    model_config = {
        "from_attributes": True
    }

# Схема для токена доступа
class Token(BaseModel):
    access_token: str
    token_type: str

# Схема для создания новой услуги
class ServiceCreate(BaseModel):
    name: str
    description: str
    price: int
    duration: int

class ServiceOut(BaseModel):
    id: int
    name: str
    description: str
    price: int
    duration: int = 0

    model_config = {
        "from_attributes": True
    }

# Схема для создания записи на прием
class AppointmentCreate(BaseModel):
    service_id: int
    appointment_time: datetime
    client_name: str
    client_phone: Optional[str] = None
    comment: Optional[str] = None
    master_id: Optional[int] = None
    status: Optional[AppointmentStatus] = AppointmentStatus.not_completed
    service_duration: Optional[int] = None

    model_config = {
        "from_attributes": True
    }

# Схема для вывода записи на прием
class AppointmentOut(BaseModel):
    id: int
    service_id: int
    appointment_time: datetime
    client_name: str
    client_phone: Optional[str] = None
    comment: Optional[str] = None
    master_id: Optional[int] = None
    status: AppointmentStatus

    model_config = {
        "from_attributes": True
    }

# Схема для вывода записи с привязанной услугой
class AppointmentWithService(BaseModel):
    id: int
    appointment_time: datetime
    client_name: str
    client_phone: Optional[str] = None
    comment: Optional[str] = None
    master_id: Optional[int] = None
    status: AppointmentStatus
    service: Optional[ServiceOut] = None

    model_config = {
        "from_attributes": True
    }

# Новая схема для обновления статуса записи
class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus

class TopMaster(BaseModel):
    master_name: str
    completed_orders: int

class TopMastersByMonth(BaseModel):
    month: int
    topMasters: List[TopMaster]