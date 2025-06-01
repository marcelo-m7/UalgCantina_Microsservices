# schemas.py
from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field
from models import DishTypeEnum


# — Allergen —

class AllergenBase(BaseModel):
    name: str
    icon: Optional[str] = None
    description: Optional[str] = None

class AllergenCreate(AllergenBase):
    id: str = Field(..., example="allergen-uuid-ou-ulid")

class AllergenUpdate(AllergenBase):
    pass

class AllergenOut(AllergenBase):
    id: str

    class Config:
        orm_mode = True


# — Dish —

class DishBase(BaseModel):
    name: str
    type: DishTypeEnum
    description: Optional[str] = None
    price: float
    kcals: Optional[int] = None
    allergen_ids: Optional[List[str]] = None

class DishCreate(DishBase):
    id: str

class DishUpdate(BaseModel):
    name: Optional[str]
    type: Optional[DishTypeEnum]
    description: Optional[str]
    price: Optional[float]
    kcals: Optional[int]
    allergen_ids: Optional[List[str]] = None

class DishOut(DishBase):
    id: str
    allergens: Optional[List[AllergenOut]] = None

    class Config:
        orm_mode = True


# — MenuEntry —

class MenuEntryBase(BaseModel):
    date: date
    meal_type: str  # "almoco" ou "jantar"
    main_dish_id: str
    alt_dish_id: Optional[str] = None
    dessert_id: str
    sopa_id: Optional[str] = None
    notes: Optional[str] = None

class MenuEntryCreate(MenuEntryBase):
    id: str

class MenuEntryUpdate(BaseModel):
    main_dish_id: str
    alt_dish_id: Optional[str] = None
    dessert_id: str
    sopa_id: Optional[str] = None
    notes: Optional[str] = None

class MenuEntryOut(MenuEntryBase):
    id: str
    main_dish: Optional[DishOut] = None
    alt_dish: Optional[DishOut] = None
    dessert: Optional[DishOut] = None
    sopa: Optional[DishOut] = None

    class Config:
        orm_mode = True
