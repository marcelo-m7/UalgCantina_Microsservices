# project/api/routers/dishes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas, auth
from ..db import SessionLocal
from ..auth import verify_token # Assuming auth module is used for authentication

router = APIRouter(
    prefix="/dishes",
    tags=["Dishes"],
    # dependencies=[Depends(verify_token)] # Uncomment to protect all dish endpoints
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Dish])
def read_dishes(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Retrieve all dishes.
    """
    dishes = (
        db.query(models.Dish)
        .options(joinedload(models.Dish.allergens)) # Load allergens relationship
        .offset(skip)
        .limit(limit)
        .all()
    )
    return dishes

@router.post("/", response_model=schemas.Dish, status_code=status.HTTP_201_CREATED)
def create_dish(
    dish: schemas.DishCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.verify_token)
):
    """
    Create a new dish.
 Protected route (requires authentication).
    """
    db_dish = models.Dish(**dish.model_dump(exclude_unset=True))
    db.add(db_dish)
    db.commit()
    db.refresh(db_dish)
    return db_dish

@router.put("/{dish_id}", response_model=schemas.Dish, dependencies=[Depends(auth.verify_token)])
def update_dish(
    dish_id: str, 
    dish_update: schemas.DishUpdate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.verify_token)
):
    """
    Update an existing dish.
 Protected route (requires authentication).
    """
    db_dish = db.query(models.Dish).options(joinedload(models.Dish.allergens)).filter(models.Dish.id == dish_id).first()
    if db_dish is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")

    for key, value in dish_update.model_dump(exclude_unset=True).items():
 if key != "allergen_ids": # Handle allergens separately
            setattr(db_dish, key, value)

 # Handle allergen relationship updates
 if dish_update.allergen_ids is not None:
 # Clear existing allergens
 db_dish.allergens.clear()
 # Add new allergens
        for allergen_id in dish_update.allergen_ids:
            allergen = db.query(models.Allergen).filter(models.Allergen.id == allergen_id).first()
            if allergen:
                db_dish.allergens.append(allergen)
 else:
 # If allergen_ids is explicitly set to None or empty list, clear allergens
 db_dish.allergens.clear()

    db.commit()
    db.refresh(db_dish)
    return db_dish

@router.delete("/{dish_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(auth.verify_token)])
def delete_dish(
    dish_id: str, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.verify_token)
):
    """
    Remove a dish.
 Protected route (requires authentication).
    """
    db_dish = db.query(models.Dish).filter(models.Dish.id == dish_id).first()
    if db_dish is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")

 # SQLAlchemy\'s cascade delete should handle dish_allergens, but explicitly clearing relationship is also an option
 # db_dish.allergens.clear()

    db.delete(db_dish)
    db.commit()
    return