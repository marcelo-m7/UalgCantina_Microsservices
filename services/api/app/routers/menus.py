# project/api/routers/menus.py
from fastapi import APIRouter, Depends, HTTPException   #, Path
from sqlalchemy.orm import Session
from datetime import timedelta # Import timedelta
# from typing import List, Optional
from datetime import date
from uuid import uuid4 # Import uuid4
from .. import models, schemas
from ..db import SessionLocal, engine
from ..auth import verify_token  # Assuming authentication is needed for admin routes

# Create database tables if they don't exist (can also be done in main.py startup)
models.Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/menus",
    tags=["Menus"],
    # dependencies=[Depends(verify_token)] # Uncomment to require auth for all menu routes
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper function to fetch dish details and attach to menu entries
def resolve_dishes_for_menu_entry(db: Session, menu_entry: models.MenuEntry):
    if menu_entry.main_dish_id:
        menu_entry.main_dish = db.query(models.Dish).filter(models.Dish.id == menu_entry.main_dish_id).first()
    if menu_entry.alt_dish_id:
        menu_entry.alt_dish = db.query(models.Dish).filter(models.Dish.id == menu_entry.alt_dish_id).first()
    if menu_entry.dessert_id:
        menu_entry.dessert = db.query(models.Dish).filter(models.Dish.id == menu_entry.dessert_id).first()
    if menu_entry.sopa_id:
        menu_entry.sopa = db.query(models.Dish).filter(models.Dish.id == menu_entry.sopa_id).first()
    return menu_entry

def build_weekly_menu(db: Session, start_date: date, end_date: date):
    weekly_menu_data = {
        "weekId": f"{start_date.isocalendar().year}-{start_date.isocalendar().week}",
        "startDate": start_date.strftime("%Y-%m-%d"),
        "endDate": end_date.strftime("%Y-%m-%d"),
        "days": []
    }

    current_date = start_date
    while current_date <= end_date:
        day_menu_data = {
            "date": current_date.strftime("%Y-%m-%d"),
            "lunch": None,
            "dinner": None
        }
        lunch_entry = db.query(models.MenuEntry).filter(
            models.MenuEntry.date == current_date.strftime("%Y-%m-%d"),
            models.MenuEntry.mealType == 'almoco'
        ).first()
        dinner_entry = db.query(models.MenuEntry).filter(
            models.MenuEntry.date == current_date.strftime("%Y-%m-%d"),
            models.MenuEntry.mealType == 'jantar'
        ).first()

        if lunch_entry:
            day_menu_data["lunch"] = resolve_dishes_for_menu_entry(db, lunch_entry)
        if dinner_entry:
            day_menu_data["dinner"] = resolve_dishes_for_menu_entry(db, dinner_entry)

        weekly_menu_data["days"].append(day_menu_data)
        current_date += timedelta(days=1)

    return schemas.WeeklyMenu.model_validate(weekly_menu_data)


# --- Public Endpoints ---

@router.get("/public/weekly/", response_model=schemas.WeeklyMenu)
def get_public_weekly_menu(db: Session = Depends(get_db)):
    # For public view, typically show the current or next week
    today = date.today()
    # Find the start and end date of the current or next week
    # This is a simplified approach, in a real app you'd handle weekly rotation logic
    start_date = today - timedelta(days=today.weekday()) # Start of current week (Monday)
    end_date = start_date + timedelta(days=6)          # End of current week (Sunday)

    return build_weekly_menu(db, start_date, end_date)


# --- Admin Endpoints ---

# Example of requiring authentication for admin routes
# router = APIRouter(
#     prefix="/menus",
#     tags=["Menus"],
#     dependencies=[Depends(verify_token)] # Requires auth for all admin menu routes
# )
# Or apply dependency per route

@router.get("/weekly-admin/", response_model=schemas.WeeklyMenu)
def get_admin_weekly_menu(
    start_date_str: str, # YYYY-MM-DD
    end_date_str: str,   # YYYY-MM-DD
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token) # Example: Require auth for admin view
):
    try:
        start_date = date.fromisoformat(start_date_str)
        end_date = date.fromisoformat(end_date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    if start_date > end_date:
        raise HTTPException(status_code=400, detail="Start date cannot be after end date.")

    # In a real admin panel, you might need logic to fetch a specific week
    # based on parameters, not just the current week.
    # This endpoint accepts start/end dates for flexibility.

    return build_weekly_menu(db, start_date, end_date)


@router.put("/day/{date_str}/{meal_type}", response_model=schemas.DayMenu)
def update_menu_entry(
    date_str: str,          # YYYY-MM-DD
    meal_type: schemas.MealType, # Use Pydantic Enum
    menu_update: schemas.MenuEntryUpdatePayload,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token) # Example: Require auth for updates
 ):
    try:
        entry_date = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    # Check if a menu entry exists for this date and meal type, create if not
    menu_entry = db.query(models.MenuEntry).filter(
        models.MenuEntry.date == date_str,
        models.MenuEntry.mealType == meal_type.value # Use .value for enum
    ).first()

    if not menu_entry:
        # Create a new entry
        menu_entry = models.MenuEntry(
            id=str(uuid4()), # Generate new UUID for the new entry
            date=date_str,
            mealType=meal_type.value,
            main_dish_id=menu_update.mainDishId,
            alt_dish_id=menu_update.altDishId,
            dessert_id=menu_update.dessertId,
            sopa_id=menu_update.sopaId,
            notes=menu_update.notes
        )
        db.add(menu_entry)
    else:
        # Update existing entry
        menu_entry.main_dish_id = menu_update.mainDishId
        menu_entry.alt_dish_id = menu_update.altDishId
        menu_entry.dessert_id = menu_update.dessertId
        menu_entry.sopa_id = menu_update.sopaId
        menu_entry.notes = menu_update.notes

    db.commit()
    db.refresh(menu_entry)

    # After update/create, return the updated DayMenu structure
    day_menu_data = {
        "date": date_str,
        "lunch": None,
        "dinner": None
    }
    # Fetch the updated entry and potentially the other meal for the day
    updated_lunch_entry = db.query(models.MenuEntry).filter(
        models.MenuEntry.date == date_str,
        models.MenuEntry.mealType == 'almoco'
    ).first()
    updated_dinner_entry = db.query(models.MenuEntry).filter(
        models.MenuEntry.date == date_str,
        models.MenuEntry.mealType == 'jantar'
    ).first()

    if updated_lunch_entry:
        day_menu_data["lunch"] = resolve_dishes_for_menu_entry(db, updated_lunch_entry)
    if updated_dinner_entry:
        day_menu_data["dinner"] = resolve_dishes_for_menu_entry(db, updated_dinner_entry)


    return schemas.DayMenu.model_validate(day_menu_data)

# Optional: Add a DELETE endpoint for a menu entry
@router.delete("/entry/{entry_id}", status_code=204)
def delete_menu_entry(
    entry_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token) # Require auth
):
    menu_entry = db.query(models.MenuEntry).filter(models.MenuEntry.id == entry_id).first()
    if not menu_entry:
        raise HTTPException(status_code=404, detail="Menu entry not found.")

    db.delete(menu_entry)
    db.commit()
    return {"detail": "Menu entry deleted successfully."}