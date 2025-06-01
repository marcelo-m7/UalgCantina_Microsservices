# services/api/app/models.py

import enum
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Text,
    Date,
    Enum,
    ForeignKey,
    UniqueConstraint,
    Table
)
from sqlalchemy.orm import relationship

from database import Base


class DishTypeEnum(str, enum.Enum):
    carne = "carne"
    peixe = "peixe"
    vegetariano = "vegetariano"
    vegan = "vegan"
    sobremesa = "sobremesa"
    sopa = "sopa"
    bebida = "bebida"


# Tabela de associação muitos-para-muitos: dishes <-> allergens
dish_allergens = Table(
    "dish_allergens",
    Base.metadata,
    Column("dish_id", String(255), ForeignKey("dishes.id", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True),
    Column("allergen_id", String(255), ForeignKey("allergens.id", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True),
)


class Allergen(Base):
    __tablename__ = "allergens"

    id = Column(String(255), primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    icon = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)

    # Relacionamento inverso a dishes
    dishes = relationship(
        "Dish",
        secondary=dish_allergens,
        back_populates="allergens"
    )


class Dish(Base):
    __tablename__ = "dishes"

    id = Column(String(255), primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    type = Column(String(50), nullable=False)  # armazenamos como string, validamos no Pydantic
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False, default=0.0)
    kcals = Column(Integer, nullable=True)

    # Relacionamento com allergens
    allergens = relationship(
        "Allergen",
        secondary=dish_allergens,
        back_populates="dishes"
    )


class MenuEntry(Base):
    __tablename__ = "menu_entries"
    __table_args__ = (
        UniqueConstraint("date", "meal_type", name="unique_date_meal"),
    )

    id = Column(String(255), primary_key=True)
    date = Column(Date, nullable=False)
    meal_type = Column(String(50), nullable=False)  # "almoco" ou "jantar"
    main_dish_id = Column(String(255), ForeignKey("dishes.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    alt_dish_id = Column(String(255), ForeignKey("dishes.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=True)
    dessert_id = Column(String(255), ForeignKey("dishes.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    sopa_id = Column(String(255), ForeignKey("dishes.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=True)
    notes = Column(Text, nullable=True)

    # Relacionamentos para poder fazer joins “automáticos”
    main_dish = relationship("Dish", foreign_keys=[main_dish_id])
    alt_dish = relationship("Dish", foreign_keys=[alt_dish_id])
    dessert = relationship("Dish", foreign_keys=[dessert_id])
    sopa = relationship("Dish", foreign_keys=[sopa_id])


class WeeklyMenu(Base):
    __tablename__ = "weekly_menus"

    week_id = Column(String(255), primary_key=True)  # ex.: "week-2023-W40"
    start_date = Column(Date, unique=True, nullable=False)
    end_date = Column(Date, nullable=False)

    # Relacionamento inverso a DayMenu
    days = relationship("DayMenu", back_populates="weekly_menu", cascade="all, delete")


class DayMenu(Base):
    __tablename__ = "day_menus"

    date = Column(Date, primary_key=True)  # ex.: "2023-10-02"
    weekly_menu_id = Column(String(255), ForeignKey("weekly_menus.week_id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    lunch_entry_id = Column(String(255), ForeignKey("menu_entries.id", ondelete="SET NULL", onupdate="CASCADE"), nullable=True)
    dinner_entry_id = Column(String(255), ForeignKey("menu_entries.id", ondelete="SET NULL", onupdate="CASCADE"), nullable=True)

    # Relacionamento com WeeklyMenu
    weekly_menu = relationship("WeeklyMenu", back_populates="days")
    # Relacionamentos a MenuEntry
    lunch_entry = relationship("MenuEntry", foreign_keys=[lunch_entry_id])
    dinner_entry = relationship("MenuEntry", foreign_keys=[dinner_entry_id])
