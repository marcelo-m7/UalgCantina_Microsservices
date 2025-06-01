# services/api/app/schemas.py

from __future__ import annotations
from datetime import date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from enum import Enum


# ------------- User (só para ilustração; a API não faz CRUD direto em users) -------------
class UserOut(BaseModel):
    id: str
    email: Optional[EmailStr]
    displayName: Optional[str]
    role: Optional[str]

    class Config:
        orm_mode = True


# ------------- Allergen -------------
class AllergenBase(BaseModel):
    name: str = Field(..., max_length=255)
    icon: Optional[str] = None
    description: Optional[str] = None


class AllergenCreate(AllergenBase):
    id: str = Field(..., max_length=255)


class AllergenUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    icon: Optional[str] = None
    description: Optional[str] = None


class AllergenOut(AllergenBase):
    id: str

    class Config:
        orm_mode = True


# ------------- Dish -------------
class DishTypeEnum(str, Enum):
    carne = "carne"
    peixe = "peixe"
    vegetariano = "vegetariano"
    vegan = "vegan"
    sobremesa = "sobremesa"
    sopa = "sopa"
    bebida = "bebida"


class DishBase(BaseModel):
    name: str = Field(..., max_length=255)
    type: DishTypeEnum
    description: Optional[str] = None
    price: float
    kcals: Optional[int] = None
    allergen_ids: List[str] = Field(default_factory=list)


class DishCreate(DishBase):
    id: str = Field(..., max_length=255)


class DishUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    type: Optional[DishTypeEnum] = None
    description: Optional[str] = None
    price: Optional[float] = None
    kcals: Optional[int] = None
    allergen_ids: List[str] = Field(default_factory=list)


class DishOut(DishBase):
    id: str
    allergens: List[AllergenOut] = Field(default_factory=list)

    class Config:
        orm_mode = True


# ------------- MenuEntry -------------
class MenuEntryBase(BaseModel):
    date: date
    meal_type: str = Field(..., pattern="^(almoco|jantar)$")
    main_dish_id: str
    alt_dish_id: Optional[str] = None
    dessert_id: str
    sopa_id: Optional[str] = None
    notes: Optional[str] = None


class MenuEntryCreate(MenuEntryBase):
    id: str = Field(..., max_length=255)


class MenuEntryUpdate(BaseModel):
    date: Optional[date] = None
    meal_type: Optional[str] = Field(None, pattern="^(almoco|jantar)$")
    main_dish_id: Optional[str] = None
    alt_dish_id: Optional[str] = None
    dessert_id: Optional[str] = None
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


# ------------- DayMenu -------------
class DayMenuBase(BaseModel):
    date: date
    weekly_menu_id: str
    lunch_entry_id: Optional[str] = None
    dinner_entry_id: Optional[str] = None


class DayMenuCreate(DayMenuBase):
    pass


class DayMenuUpdate(BaseModel):
    lunch_entry_id: Optional[str] = None
    dinner_entry_id: Optional[str] = None


class DayMenuOut(DayMenuBase):
    lunch_entry: Optional[MenuEntryOut] = None
    dinner_entry: Optional[MenuEntryOut] = None

    class Config:
        orm_mode = True


# ------------- WeeklyMenu -------------
class WeeklyMenuBase(BaseModel):
    week_id: str = Field(..., max_length=255)
    start_date: date
    end_date: date


class WeeklyMenuCreate(WeeklyMenuBase):
    pass


class WeeklyMenuUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class WeeklyMenuOut(WeeklyMenuBase):
    days: List[DayMenuOut] = Field(default_factory=list)

    class Config:
        orm_mode = True
