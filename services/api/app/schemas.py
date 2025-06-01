# project/api/schemas.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import enum

class DishType(str, enum.Enum):
    carne = "carne"
    peixe = "peixe"
    vegetariano = "vegetariano"
    vegan = "vegan"
    sobremesa = "sobremesa"
    sopa = "sopa"
    bebida = "bebida"

class MealType(str, enum.Enum):
    almoco = "almoco"
    jantar = "jantar"

class AllergenBase(BaseModel):
    name: str
    icon: Optional[str] = None
    description: Optional[str] = None

class AllergenCreate(AllergenBase):
    id: str # Assuming UUID or similar string ID generation happens client-side or here

class AllergenUpdate(AllergenBase):
    name: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[str] = None

class Allergen(AllergenBase):
    id: str

    class Config:
        orm_mode = True

class DishBase(BaseModel):
    name: str
    type: DishType
    description: Optional[str] = None
    price: float
    kcals: Optional[int] = None

class DishCreate(DishBase):
    id: str # Assuming UUID or similar string ID generation happens client-side or here
    allergen_ids: Optional[List[str]] = [] # For creating/updating dish with allergen IDs

class DishUpdate(DishBase):
    name: Optional[str] = None
    type: Optional[DishType] = None
    description: Optional[str] = None
    price: Optional[float] = None
    kcals: Optional[int] = None
    allergen_ids: Optional[List[str]] = None # Use None to indicate no change, [] to clear

class Dish(DishBase):
    id: str
    allergens: List[Allergen] = [] # Include related Allergen objects when reading a Dish

    class Config:
        orm_mode = True

class MenuEntryBase(BaseModel):
    date: date
    meal_type: MealType
    notes: Optional[str] = None

class MenuEntryCreatePayload(BaseModel):
    mainDishId: Optional[str] = None
    altDishId: Optional[str] = None
    dessertId: Optional[str] = None
    sopaId: Optional[str] = None
    notes: Optional[str] = None

class MenuEntry(MenuEntryBase):
    id: str
    main_dish_id: Optional[str] = None
    alt_dish_id: Optional[str] = None
    dessert_id: Optional[str] = None
    sopa_id: Optional[str] = None

    # Optional linked Dish objects when reading a MenuEntry
    main_dish: Optional[Dish] = None
    alt_dish: Optional[Dish] = None
    dessert: Optional[Dish] = None
    sopa: Optional[Dish] = None

    class Config:
        orm_mode = True
        # Allow population by field name as well as alias for camelCase
        allow_population_by_field_name = True
        # Configure aliases for camelCase fields in payload if needed
        # But since we are using explicit field names in MenuEntryCreatePayload
        # matching the DB columns, this might not be strictly necessary here.
        # For consistency with frontend, we might define aliases if frontend sends camelCase.
        # For now, let's rely on model_validate and direct field names.


class DayMenu(BaseModel):
    date: date
    lunch: Optional[MenuEntry] = None
    dinner: Optional[MenuEntry] = None

    class Config:
         orm_mode = True # Allow ORM objects to be used in construction

class WeeklyMenu(BaseModel):
    weekId: str
    startDate: date
    endDate: date
    days: List[DayMenu]

    class Config:
         orm_mode = True # Allow ORM objects to be used in construction
         # Configure aliases for camelCase fields if frontend expects them this way
         fields = {
             "weekId": "weekId",
             "startDate": "startDate",
             "endDate": "endDate",
             "days": "days"
         }