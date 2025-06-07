from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models import UserRole, AppointmentStatus  # Подключаем AppointmentStatus для использования в Pydantic схемах

# Схема для создания нового пользователя
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[UserRole] = UserRole.client  # По умолчанию роль клиента

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

    model_config = {  # Используем model_config вместо Config
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

# Схема для вывода услуги
class ServiceOut(BaseModel):
    id: int
    name: str
    description: str
    price: int

    model_config = {  # Используем model_config вместо Config
        "from_attributes": True
    }

# Схема для создания записи на прием
class AppointmentCreate(BaseModel):
    service_id: int
    appointment_time: datetime
    client_name: str  # Добавляем поле для имени клиента
    client_phone: Optional[str] = None  # Добавляем поле для телефона клиента
    comment: Optional[str] = None  # Новое поле для комментария
    master_id: Optional[int] = None  # ID мастера, если выбран
    status: Optional[AppointmentStatus] = AppointmentStatus.not_completed  # Статус с умолчанием на 'не выполнено'

    model_config = {  # Добавляем model_config для этой модели
        "from_attributes": True
    }

# Схема для вывода записи на прием
class AppointmentOut(BaseModel):
    id: int
    service_id: int
    appointment_time: datetime
    client_name: str  # Имя клиента
    client_phone: Optional[str] = None  # Телефон клиента
    comment: Optional[str] = None  # Комментарий
    master_id: Optional[int] = None  # ID мастера, если выбран
    status: AppointmentStatus  # Статус выполнения услуги

    model_config = {  # Используем model_config вместо Config
        "from_attributes": True
    }

# Схема для вывода записи с привязанной услугой
class AppointmentWithService(BaseModel):
    id: int
    appointment_time: datetime
    client_name: str  # Имя клиента
    client_phone: Optional[str] = None  # Телефон клиента
    comment: Optional[str] = None  # Комментарий
    master_id: Optional[int] = None  # Мастер
    status: AppointmentStatus  # Статус выполнения
    service: ServiceOut  # Связь с услугой

    model_config = {  # Используем model_config вместо Config
        "from_attributes": True
    }

# Новая схема для обновления статуса записи
class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus  # Ожидаем статус для обновления записи
