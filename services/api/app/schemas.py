# services/api/app/schemas.py

from __future__ import annotations
from datetime import date
from typing import Optional, List
from pydantic import BaseModel, Field
from pydantic import ConfigDict
from enum import Enum


def to_camel(string: str) -> str:
    """
    Converte snake_case em camelCase, 
    para que Pydantic gere a saída JSON em camelCase automaticamente.
    """
    parts = string.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])


class CamelModel(BaseModel):
    """
    Classe base que:

    - Usa alias_generator=to_camel (conversão snake_case -> camelCase)
    - populate_by_name=True (permite aceitar tanto snake_case quanto camelCase como input)
    - from_attributes=True (permite ler atributos de objetos ORM diretamente)
    """
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


# ----------------------------------------------------
#   MODELS
# ----------------------------------------------------

# ------------- User (só para ilustração; a API não faz CRUD direto em users) -------------
class UserOut(CamelModel):
    id: str
    email: Optional[str]
    display_name: Optional[str]
    role: Optional[str]

    # Não é necessário especificar orm_mode; já está em CamelModel
    # class Config:
    #     orm_mode = True


# ------------- Allergen -------------
class AllergenBase(CamelModel):
    name: str = Field(..., max_length=255)
    icon: Optional[str] = None
    description: Optional[str] = None


class AllergenCreate(AllergenBase):
    id: str = Field(..., max_length=255)


class AllergenUpdate(CamelModel):
    name: Optional[str] = Field(None, max_length=255)
    icon: Optional[str] = None
    description: Optional[str] = None


class AllergenOut(AllergenBase):
    id: str


# ------------- Dish -------------
class DishTypeEnum(str, Enum):
    carne = "carne"
    peixe = "peixe"
    vegetariano = "vegetariano"
    vegan = "vegan"
    sobremesa = "sobremesa"
    sopa = "sopa"
    bebida = "bebida"


class DishBase(CamelModel):
    name: str = Field(..., max_length=255)
    type: DishTypeEnum
    description: Optional[str] = None
    price: float
    kcals: Optional[int] = None
    allergen_ids: List[str] = Field(default_factory=list)


class DishCreate(DishBase):
    id: str = Field(..., max_length=255)


class DishUpdate(CamelModel):
    name: Optional[str] = Field(None, max_length=255)
    type: Optional[DishTypeEnum] = None
    description: Optional[str] = None
    price: Optional[float] = None
    kcals: Optional[int] = None
    allergen_ids: List[str] = Field(default_factory=list)


class DishOut(DishBase):
    id: str
    allergens: List[AllergenOut] = Field(default_factory=list)


# ------------- MenuEntry -------------
class MenuEntryBase(CamelModel):
    date: date
    meal_type: str = Field(..., pattern="^(almoco|jantar)$")
    main_dish_id: str
    alt_dish_id: Optional[str] = None
    dessert_id: str
    sopa_id: Optional[str] = None
    notes: Optional[str] = None


class MenuEntryCreate(MenuEntryBase):
    id: str = Field(..., max_length=255)


class MenuEntryUpdate(CamelModel):
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


# ------------- DayMenu -------------
class DayMenuBase(CamelModel):
    date: date
    weekly_menu_id: str
    lunch_entry_id: Optional[str] = None
    dinner_entry_id: Optional[str] = None


class DayMenuCreate(DayMenuBase):
    pass


class DayMenuUpdate(CamelModel):
    lunch_entry_id: Optional[str] = None
    dinner_entry_id: Optional[str] = None


class DayMenuOut(CamelModel):
    date: date
    lunch_entry: Optional[MenuEntryOut] = Field(
        default=None, serialization_alias="lunch"
    )
    dinner_entry: Optional[MenuEntryOut] = Field(
        default=None, serialization_alias="dinner"
    )


# ------------- WeeklyMenu -------------
class WeeklyMenuBase(CamelModel):
    week_id: str = Field(..., max_length=255)
    start_date: date
    end_date: date


class WeeklyMenuCreate(WeeklyMenuBase):
    pass


class WeeklyMenuUpdate(CamelModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class WeeklyMenuOut(WeeklyMenuBase):
    days: List[DayMenuOut] = Field(default_factory=list)
