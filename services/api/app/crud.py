# services/api/app/crud.py
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

import models, schemas


# ------------- Allergens -------------
def get_all_allergens(db: Session) -> list[models.Allergen]:
    return db.query(models.Allergen).all()


def get_allergen(db: Session, allergen_id: str) -> models.Allergen | None:
    return db.query(models.Allergen).filter(models.Allergen.id == allergen_id).first()


def create_allergen(db: Session, allergen_in: schemas.AllergenCreate) -> models.Allergen:
    db_obj = models.Allergen(
        id=allergen_in.id,
        name=allergen_in.name,
        icon=allergen_in.icon,
        description=allergen_in.description
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_allergen(db: Session, allergen_id: str, allergen_in: schemas.AllergenUpdate) -> models.Allergen:
    db_obj = get_allergen(db, allergen_id)
    if not db_obj:
        return None
    for field, value in allergen_in.dict(exclude_none=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_allergen(db: Session, allergen_id: str) -> None:
    db_obj = get_allergen(db, allergen_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()


# ------------- Dishes -------------
def get_all_dishes(db: Session) -> list[models.Dish]:
    return db.query(models.Dish).all()


def get_dish(db: Session, dish_id: str) -> models.Dish | None:
    return db.query(models.Dish).filter(models.Dish.id == dish_id).first()


def create_dish(db: Session, dish_in: schemas.DishCreate) -> models.Dish:
    db_obj = models.Dish(
        id=dish_in.id,
        name=dish_in.name,
        type=dish_in.type.value,
        description=dish_in.description,
        price=dish_in.price,
        kcals=dish_in.kcals
    )
    if dish_in.allergen_ids:
        allergens = db.query(models.Allergen).filter(models.Allergen.id.in_(dish_in.allergen_ids)).all()
        db_obj.allergens = allergens
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_dish(db: Session, dish_id: str, dish_in: schemas.DishUpdate) -> models.Dish | None:
    db_obj = get_dish(db, dish_id)
    if not db_obj:
        return None
    data = dish_in.dict(exclude_none=True)
    if "allergen_ids" in data:
        # Atualiza lista de alergênicos
        allergens = db.query(models.Allergen).filter(models.Allergen.id.in_(data["allergen_ids"])).all()
        db_obj.allergens = allergens
        data.pop("allergen_ids")
    for field, value in data.items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_dish(db: Session, dish_id: str) -> None:
    db_obj = get_dish(db, dish_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()


# ------------- MenuEntry -------------
def get_menu_entry(db: Session, entry_id: str) -> models.MenuEntry | None:
    return db.query(models.MenuEntry).filter(models.MenuEntry.id == entry_id).first()


def get_all_menu_entries(db: Session) -> list[models.MenuEntry]:
    return db.query(models.MenuEntry).all()


def create_menu_entry(db: Session, entry_in: schemas.MenuEntryCreate) -> models.MenuEntry:
    db_obj = models.MenuEntry(
        id=entry_in.id,
        date=entry_in.date,
        meal_type=entry_in.meal_type,
        main_dish_id=entry_in.main_dish_id,
        alt_dish_id=entry_in.alt_dish_id,
        dessert_id=entry_in.dessert_id,
        sopa_id=entry_in.sopa_id,
        notes=entry_in.notes
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_menu_entry(db: Session, entry_id: str, entry_in: schemas.MenuEntryUpdate) -> models.MenuEntry | None:
    db_obj = get_menu_entry(db, entry_id)
    if not db_obj:
        return None
    for field, value in entry_in.dict(exclude_none=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_menu_entry(db: Session, entry_id: str) -> None:
    db_obj = get_menu_entry(db, entry_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()


# ------------- WeeklyMenu -------------
# crud.py  (exemplo simples)
def get_weekly_menu(db: Session, week_id: str):
    weekly = db.query(models.WeeklyMenu).filter_by(week_id=week_id).first()
    if weekly and weekly.days is None:
        weekly.days = []        # ← garante lista vazia
    return weekly



def get_all_weekly_menus(db: Session) -> list[models.WeeklyMenu]:
    return db.query(models.WeeklyMenu).all()


def create_weekly_menu(db: Session, menu_in: schemas.WeeklyMenuCreate) -> models.WeeklyMenu:
    db_obj = models.WeeklyMenu(
        week_id=menu_in.week_id,
        start_date=menu_in.start_date,
        end_date=menu_in.end_date
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_weekly_menu(db: Session, week_id: str, menu_in: schemas.WeeklyMenuUpdate) -> models.WeeklyMenu | None:
    db_obj = get_weekly_menu(db, week_id)
    if not db_obj:
        return None
    for field, value in menu_in.dict(exclude_none=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_weekly_menu(db: Session, week_id: str) -> None:
    db_obj = get_weekly_menu(db, week_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()


# ------------- DayMenu -------------
def get_day_menu(db: Session, date: date) -> models.DayMenu | None:
    return db.query(models.DayMenu).filter(models.DayMenu.date == date).first()


def get_all_day_menus(db: Session) -> list[models.DayMenu]:
    return db.query(models.DayMenu).all()


def create_day_menu(db: Session, day_in: schemas.DayMenuCreate) -> models.DayMenu:
    db_obj = models.DayMenu(
        date=day_in.date,
        weekly_menu_id=day_in.weekly_menu_id,
        lunch_entry_id=day_in.lunch_entry_id,
        dinner_entry_id=day_in.dinner_entry_id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_day_menu(db: Session, date: date, day_in: schemas.DayMenuUpdate) -> models.DayMenu | None:
    db_obj = get_day_menu(db, date)
    if not db_obj:
        return None
    for field, value in day_in.dict(exclude_none=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_day_menu(db: Session, date: date) -> None:
    db_obj = get_day_menu(db, date)
    if db_obj:
        db.delete(db_obj)
        db.commit()
