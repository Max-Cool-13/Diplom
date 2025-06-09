from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SqlEnum
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    client = "client"
    master = "master"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(SqlEnum(UserRole), nullable=False, default=UserRole.client)

    # Отношение для пользователей (клиентов)
    appointments = relationship("Appointment", back_populates="user", foreign_keys="[Appointment.user_id]")  # Используем user_id

    # Отношение для мастеров
    master_appointments = relationship("Appointment", back_populates="master", foreign_keys="[Appointment.master_id]")  # Используем master_id

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Integer)
    duration = Column(Integer, nullable=False)

    appointments = relationship("Appointment", back_populates="service")


class AppointmentStatus(str, enum.Enum):
    completed = "completed"
    not_completed = "not_completed"


class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # Внешний ключ на клиента
    service_id = Column(Integer, ForeignKey("services.id"))
    appointment_time = Column(DateTime)

    # Поля для имени клиента и номера телефона
    client_name = Column(String, nullable=False)  # Имя клиента
    client_phone = Column(String, nullable=True)  # Номер телефона клиента
    status = Column(SqlEnum(AppointmentStatus), default=AppointmentStatus.not_completed)  # Статус выполнения

    # Новые поля
    comment = Column(String, nullable=True)  # Поле для комментариев
    master_id = Column(Integer, ForeignKey("users.id"))  # Поле для мастера (ссылка на User)

    # Определение отношений
    user = relationship("User", back_populates="appointments", foreign_keys=[user_id])  # Отношение с пользователем (клиентом)
    service = relationship("Service", back_populates="appointments")
    master = relationship("User", back_populates="appointments", foreign_keys=[master_id])  # Отношение с мастером

