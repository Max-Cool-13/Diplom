from app.models import Service, Appointment
from app.schemas import ServiceCreate, AppointmentCreate
from sqlalchemy.orm import Session
from datetime import datetime


# Добавление новой услуги
def create_service(db: Session, service: ServiceCreate):
    db_service = Service(name=service.name, description=service.description, price=service.price)
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service


# Запись на услугу
def create_appointment(db: Session, appointment: AppointmentCreate, user_id: int):
    # Создаем новую запись с учетом полей для комментария и мастера
    db_appointment = Appointment(
        user_id=user_id,
        service_id=appointment.service_id,
        appointment_time=appointment.appointment_time,
        client_name=appointment.client_name,  # Имя клиента
        client_phone=appointment.client_phone,  # Номер телефона клиента
        status=appointment.status,  # Статус выполнения
        comment=appointment.comment,  # Новый параметр комментарий
        master_id=appointment.master_id  # Новый параметр мастера
    )

    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment
