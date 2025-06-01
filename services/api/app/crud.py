# crud.py
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional

import models, schemas


# — ALLERGEN CRUD —

def get_all_allergens(db: Session) -> List[models.Allergen]:
    return db.query(models.Allergen).all()

def get_allergen(db: Session, allergen_id: str) -> Optional[models.Allergen]:
    return db.get(models.Allergen, allergen_id)

def create_allergen(db: Session, obj_in: schemas.AllergenCreate) -> models.Allergen:
    db_obj = models.Allergen(**obj_in.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_allergen(db: Session, db_obj: models.Allergen, obj_in: schemas.AllergenUpdate):
    for field, val in obj_in.dict(exclude_unset=True).items():
        setattr(db_obj, field, val)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_allergen(db: Session, db_obj: models.Allergen):
    db.delete(db_obj)
    db.commit()


# — DISH CRUD —

def get_all_dishes(db: Session) -> List[models.Dish]:
    return db.query(models.Dish).all()

def get_dish(db: Session, dish_id: str) -> Optional[models.Dish]:
    return db.get(models.Dish, dish_id)

def create_dish(db: Session, obj_in: schemas.DishCreate) -> models.Dish:
    allergen_ids = obj_in.allergen_ids or []
    db_obj = models.Dish(
        id=obj_in.id,
        name=obj_in.name,
        type=obj_in.type,
        description=obj_in.description,
        price=obj_in.price,
        kcals=obj_in.kcals,
    )
    if allergen_ids:
        alergs = db.query(models.Allergen).filter(models.Allergen.id.in_(allergen_ids)).all()
        db_obj.allergens = alergs
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_dish(db: Session, db_obj: models.Dish, obj_in: schemas.DishUpdate) -> models.Dish:
    data = obj_in.dict(exclude_unset=True)
    if "allergen_ids" in data:
        alergs = db.query(models.Allergen).filter(models.Allergen.id.in_(data["allergen_ids"])).all()
        db_obj.allergens = alergs
        data.pop("allergen_ids")
    for field, val in data.items():
        setattr(db_obj, field, val)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_dish(db: Session, db_obj: models.Dish):
    db.delete(db_obj)
    db.commit()


# — MENU ENTRY CRUD —

def get_menu_by_date_meal(db: Session, menu_date: date, meal_type: str) -> Optional[models.MenuEntry]:
    return (
        db.query(models.MenuEntry)
        .filter(models.MenuEntry.date == menu_date, models.MenuEntry.meal_type == meal_type)
        .first()
    )

def get_all_menu(db: Session) -> List[models.MenuEntry]:
    return db.query(models.MenuEntry).all()

def create_menu(db: Session, obj_in: schemas.MenuEntryCreate) -> models.MenuEntry:
    db_obj = models.MenuEntry(
        id=obj_in.id,
        date=obj_in.date,
        meal_type=obj_in.meal_type,
        main_dish_id=obj_in.main_dish_id,
        alt_dish_id=obj_in.alt_dish_id,
        dessert_id=obj_in.dessert_id,
        sopa_id=obj_in.sopa_id,
        notes=obj_in.notes,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_menu(db: Session, db_obj: models.MenuEntry, obj_in: schemas.MenuEntryUpdate):
    for field, val in obj_in.dict(exclude_unset=True).items():
        setattr(db_obj, field, val)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_menu(db: Session, db_obj: models.MenuEntry):
    db.delete(db_obj)
    db.commit()
