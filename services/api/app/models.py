# models.py
import enum
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Enum,
    Table,
    ForeignKey,
    Text,
    Date,
)
from sqlalchemy.orm import relationship
from database import Base


# Tabela intermediária para relação many-to-many Dish ↔ Allergen
dish_allergen = Table(
    "dish_allergen",
    Base.metadata,
    Column("dish_id", String(36), ForeignKey("dishes.id"), primary_key=True),
    Column("allergen_id", String(36), ForeignKey("allergens.id"), primary_key=True),
)


class DishTypeEnum(str, enum.Enum):
    carne = "carne"
    peixe = "peixe"
    vegetariano = "vegetariano"
    vegan = "vegan"
    sobremesa = "sobremesa"
    sopa = "sopa"
    bebida = "bebida"


class Allergen(Base):
    __tablename__ = "allergens"
    id = Column(String(36), primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    icon = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)

    # Relacionamento many-to-many
    dishes = relationship(
        "Dish",
        secondary=dish_allergen,
        back_populates="allergens"
    )


class Dish(Base):
    __tablename__ = "dishes"
    id = Column(String(36), primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    type = Column(Enum(DishTypeEnum), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False, default=0.0)
    kcals = Column(Integer, nullable=True)

    allergens = relationship(
        "Allergen",
        secondary=dish_allergen,
        back_populates="dishes"
    )


class MenuEntry(Base):
    __tablename__ = "menu_entries"
    id = Column(String(36), primary_key=True)
    date = Column(Date, nullable=False)             # ex: 2025-06-01
    meal_type = Column(String(10), nullable=False)   # "almoco" ou "jantar"

    main_dish_id = Column(String(36), ForeignKey("dishes.id"), nullable=False)
    alt_dish_id = Column(String(36), ForeignKey("dishes.id"), nullable=True)
    dessert_id = Column(String(36), ForeignKey("dishes.id"), nullable=False)
    sopa_id = Column(String(36), ForeignKey("dishes.id"), nullable=True)

    notes = Column(Text, nullable=True)

    # Relacionamentos para facilitar JOIN no retorno
    main_dish = relationship("Dish", foreign_keys=[main_dish_id])
    alt_dish = relationship("Dish", foreign_keys=[alt_dish_id])
    dessert = relationship("Dish", foreign_keys=[dessert_id])
    sopa = relationship("Dish", foreign_keys=[sopa_id])
