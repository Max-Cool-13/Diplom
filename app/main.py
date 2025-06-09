from fastapi import FastAPI, Depends, HTTPException, APIRouter, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from app import models, schemas, auth, crud
from app.database import engine, get_db
from fastapi import status
from sqlalchemy import func
from app.models import Appointment, User
from collections import defaultdict
from datetime import timedelta

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


@app.post("/register/", response_model=schemas.UserOut, tags=["users"])
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if user.role not in [models.UserRole.client, models.UserRole.master]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'client' or 'master'.")
    try:
        return crud.create_user(db=db, user=user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/login/", response_model=schemas.Token, tags=["users"])
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.delete("/users/{user_id}", tags=["users"])
def delete_user(
        user_id: int,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_admin)  # только админ
):
    user = crud.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Передаем только user_id вместо объекта user
    if not crud.delete_user(db=db, user_id=user_id):
        raise HTTPException(status_code=404, detail="User not found")

    return {"detail": "User deleted"}


@app.patch("/users/me", response_model=schemas.UserOut, tags=["users"])
def update_profile(
        updates: schemas.UserUpdate,  # Получаем данные для обновления
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_user)  # Получаем текущего авторизованного пользователя
):
    if updates.password:  # Если передан новый пароль, хешируем его перед сохранением
        updates.password = auth.get_password_hash(updates.password)

    updated_user = crud.update_user(db=db, db_user=current_user, updates=updates)  # Обновляем данные пользователя
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user


@app.get("/users/", response_model=List[schemas.UserOut], tags=["users"])
def get_all_users(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    users = db.query(models.User).all()
    return users


@app.get("/services/", response_model=List[schemas.ServiceOut], tags=["services"])
def get_services(db: Session = Depends(get_db)):
    services = crud.get_all_services(db=db)
    # Убедитесь, что все услуги имеют значение для duration
    for service in services:
        if service.duration is None:
            service.duration = 0  # Устанавливаем значение по умолчанию
    return services


@app.post("/services/", response_model=schemas.ServiceOut, tags=["services"])
def create_service(
        service: schemas.ServiceCreate,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_admin)
):
    return crud.create_service(db=db, service=service)


@app.delete("/services/{service_id}", tags=["services"])
def delete_service(
        service_id: int,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_admin)
):
    service = crud.delete_service(db=db, service_id=service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"detail": "Service deleted"}


from datetime import timedelta

from datetime import timedelta

@app.post("/appointments/", response_model=schemas.AppointmentOut, tags=["appointments"])
def create_appointment(
        appointment: schemas.AppointmentCreate,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_user)
):
    # Получаем услугу для вычисления времени выполнения
    service = db.query(models.Service).filter(models.Service.id == appointment.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # Если время выполнения (duration) отсутствует, присваиваем значение по умолчанию (0 минут)
    service_duration = service.duration if service.duration is not None else 0

    # Рассчитываем время окончания записи (время начала + продолжительность услуги)
    end_time = appointment.appointment_time + timedelta(minutes=service_duration)

    # Проверка на занятость времени с учетом времени выполнения услуги
    existing_appointment = db.query(models.Appointment).filter(
        models.Appointment.service_id == appointment.service_id,
        models.Appointment.appointment_time == appointment.appointment_time
    ).first()

    # Проверяем, не пересекается ли выбранное время с уже существующими записями
    overlapping_appointments = db.query(models.Appointment).filter(
        models.Appointment.service_id == appointment.service_id,
        (
            (models.Appointment.appointment_time < end_time) &  # Время начала новой записи до окончания существующей
            (models.Appointment.appointment_time >= appointment.appointment_time)  # Начало новой записи после начала существующей
        ) | (
            (end_time > models.Appointment.appointment_time) &  # Время окончания новой записи после начала существующей
            (appointment.appointment_time <= models.Appointment.appointment_time)  # Начало новой записи до окончания существующей
        )
    ).all()

    if overlapping_appointments:
        return {
            "detail": "The selected time slot is not available. Please choose a different time."
        }

    # Создание записи
    new_appointment = crud.create_appointment(
        db=db,
        appointment=appointment,
        user_id=current_user.id
    )

    return new_appointment


@app.get("/appointments/", response_model=List[schemas.AppointmentOut], tags=["appointments"])
def get_user_appointments(
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_user_appointments(db=db, user_id=current_user.id)


@app.get("/appointments/history/", response_model=List[schemas.AppointmentWithService], tags=["appointments"])
def get_my_appointments(
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_user)
):
    # Получаем все записи пользователя
    appointments = crud.get_user_appointments(db=db, user_id=current_user.id)

    # Фильтруем записи, у которых нет связанной услуги
    appointments_with_service = []
    for appointment in appointments:
        if appointment.service:  # Если услуга существует, добавляем запись в ответ
            # Убедимся, что поле duration у услуги всегда задано (например, 0)
            appointment.service.duration = appointment.service.duration or 0
            appointments_with_service.append(appointment)

    return appointments_with_service


@app.get("/users/me", response_model=schemas.UserOut, tags=["users"])
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@app.get("/services/{service_id}", response_model=schemas.ServiceOut, tags=["services"])
def get_service_by_id(service_id: int, db: Session = Depends(get_db)):
    service = crud.get_service_by_id(db=db, service_id=service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # Проверяем и устанавливаем значение по умолчанию для поля duration, если оно None
    if service.duration is None:
        service.duration = 0  # Устанавливаем значение по умолчанию для duration

    return service

@app.delete("/appointments/{appointment_id}", response_model=schemas.AppointmentOut, tags=["appointments"])
def delete_appointment(
        appointment_id: int,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_user)
):
    # Ищем запись по ID
    appointment = crud.get_appointment_by_id(db=db, appointment_id=appointment_id)

    # Если запись не найдена
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Проверяем, принадлежит ли запись текущему пользователю
    if appointment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this appointment")

    # Удаляем запись
    crud.delete_appointment(db=db, appointment_id=appointment_id)

    return appointment  # Возвращаем удаленную запись (можно вернуть сообщение об успехе, если нужно)

@app.get("/masters/", response_model=List[schemas.UserOut], tags=["users"])
def get_masters(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    """
    Получение списка мастеров (доступно для всех авторизованных пользователей)
    """
    masters = db.query(models.User).filter(models.User.role == models.UserRole.master).all()
    return masters

@app.get("/clients/", response_model=List[schemas.UserOut], tags=["users"])
def get_clients(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    """
    Получение списка клиентов (доступно только для администраторов)
    """
    clients = db.query(models.User).filter(models.User.role == models.UserRole.client).all()
    return clients

@app.get("/appointments/master/{master_id}", response_model=List[schemas.AppointmentWithService], tags=["appointments"])
def get_master_appointments(
        master_id: int,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_user)
):
    """
    Получение списка записей для мастера по его ID
    """
    if current_user.id != master_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to view these appointments")

    appointments = db.query(models.Appointment).filter(models.Appointment.master_id == master_id).all()

    # Фильтруем записи, у которых нет связанной услуги
    appointments_with_service = []
    for appointment in appointments:
        if appointment.service:  # Если услуга существует
            appointments_with_service.append(appointment)

    # Возвращаем только те записи, у которых есть услуга
    return appointments_with_service


@app.patch("/appointments/{appointment_id}/status", response_model=schemas.AppointmentOut, tags=["appointments"])
def update_appointment_status(
        appointment_id: int,
        status_update: schemas.AppointmentStatusUpdate,  # Ожидаем объект с полем "status" в теле запроса
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_user)
):
    status = status_update.status  # Извлекаем статус из тела запроса

    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    if current_user.id != appointment.master_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="У вас нет прав для изменения статуса")

    appointment.status = status
    db.commit()
    db.refresh(appointment)

    return appointment

@app.get("/users/{user_id}", response_model=schemas.UserOut, tags=["users"])
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/appointments/check", response_model=bool, tags=["appointments"])
def check_appointment_availability(
        service_id: int,
        appointment_time: str,  # время в формате ISO
        db: Session = Depends(get_db)
):
    # Преобразование строки времени в объект datetime
    from datetime import datetime
    appointment_datetime = datetime.fromisoformat(appointment_time)

    # Проверка на занятость времени
    existing_appointment = db.query(models.Appointment).filter(
        models.Appointment.service_id == service_id,
        models.Appointment.appointment_time == appointment_datetime
    ).first()

    # Если время уже занято
    if existing_appointment:
        return False
    return True

@app.get("/appointments/", response_model=List[schemas.AppointmentOut], tags=["appointments"])
def get_all_appointments(db: Session = Depends(get_db)):
    appointments = db.query(models.Appointment).all()
    for appointment in appointments:
        # Проверяем и заменяем пустые значения на пустую строку или дефолтные значения
        if not appointment.client_name:
            appointment.client_name = "Не указан"
        if appointment.status not in ["completed", "not_completed"]:
            appointment.status = "not_completed"  # Применяем дефолтный статус, если статус некорректный
    return appointments

@router.get("/top-masters/{year}", response_model=dict, tags=["users"])
def get_top_masters_by_month(year: int, db: Session = Depends(get_db)):
    # Запрос для получения всех выполненных заказов по месяцам
    result = db.query(
        func.extract('month', Appointment.appointment_time).label('month'),
        Appointment.master_id,
        func.count(Appointment.id).label('completed_orders')
    ).filter(
        Appointment.status == 'completed',  # Только выполненные заказы
        func.extract('year', Appointment.appointment_time) == year  # Фильтруем по году
    ).group_by(
        'month', Appointment.master_id
    ).order_by(
        'month', func.count(Appointment.id).desc()  # Сортировка по количеству заказов, убыванию
    ).all()

    # Формируем структуру данных по месяцам
    top_masters_by_month = defaultdict(list)

    for row in result:
        month = int(row.month)
        master = db.query(User).filter(User.id == row.master_id).first()
        top_masters_by_month[month].append({
            'master_name': master.username,
            'completed_orders': row.completed_orders
        })

    return top_masters_by_month

@app.get("/users/all", response_model=List[schemas.UserOut], tags=["users"])
def get_all_users(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    """
    Получение списка всех пользователей для админа
    """
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="You do not have permission to view this resource")

    clients = db.query(models.User).filter(models.User.role == models.UserRole.client).all()
    masters = db.query(models.User).filter(models.User.role == models.UserRole.master).all()

    return {"clients": clients, "masters": masters}

@app.get("/appointments/all", response_model=List[schemas.AppointmentWithService], tags=["appointments"])
def get_all_appointments(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    """
    Получение всех записей для админа
    """
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="You do not have permission to view this resource")

    appointments = db.query(models.Appointment).all()
    return appointments


@app.get("/appointments/top-masters/{year}", response_model=List[schemas.TopMastersByMonth], tags=["appointments"])
def get_top_masters_by_month(year: int, db: Session = Depends(get_db)):
    # Запрос для получения всех выполненных заказов по месяцам
    result = db.query(
        func.extract('month', Appointment.appointment_time).label('month'),
        Appointment.master_id,
        func.count(Appointment.id).label('completed_orders')
    ).filter(
        Appointment.status == 'completed',  # Только выполненные заказы
        func.extract('year', Appointment.appointment_time) == year  # Фильтруем по году
    ).group_by(
        'month', Appointment.master_id
    ).order_by(
        'month', func.count(Appointment.id).desc()  # Сортировка по количеству заказов, убыванию
    ).all()

    # Формируем структуру данных по месяцам
    top_masters_by_month = defaultdict(list)

    for row in result:
        month = int(row.month)
        master = db.query(models.User).filter(models.User.id == row.master_id).first()

        # Добавляем только имя мастера и количество его заказов
        top_masters_by_month[month].append({
            'master_name': master.username,
            'completed_orders': row.completed_orders
        })

    return [{"month": month, "topMasters": top_masters_by_month[month]} for month in top_masters_by_month]