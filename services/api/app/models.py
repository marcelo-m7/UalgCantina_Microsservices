# api/models.py
from sqlalchemy import Table, Column, String, Integer, Float, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db import Base
import enum

class DishType(enum.Enum):
    carne = "carne"
    peixe = "peixe"
    vegetariano = "vegetariano"
    vegan = "vegan"
    sobremesa = "sobremesa"
    sopa = "sopa"
    bebida = "bebida"

class MealType(enum.Enum):
    almoco = "almoco"
    jantar = "jantar"

# Association table for many-to-many relationship between Dish and Allergen
dish_allergens = Table(
    "dish_allergens",
    Base.metadata,
    Column("dish_id", String(255), ForeignKey("dishes.id"), primary_key=True),
    Column("allergen_id", String(255), ForeignKey("allergens.id"), primary_key=True)
)



class Allergen(Base):
    __tablename__ = "allergens"

    id = Column(String(255), primary_key=True, index=True) # Assuming UUID or similar string ID
    name = Column(String, unique=True, index=True)
    icon = Column(String, nullable=True)
    description = Column(String, nullable=True)

    # Relationship to Dish models (Many-to-Many through association table if needed,
    # but the prompt suggests allergenIds in Dish, so we'll handle this in the API logic
    # or potentially use a JSON column for simplicity if the list is small/flexible)
    # For simplicity here, we won't define a direct relationship back from Allergen to Dish

    dishes = relationship("Dish", secondary=dish_allergens, backref="allergens")

class Dish(Base):
    __tablename__ = "dishes"

    id = Column(String(255), primary_key=True, index=True) # Assuming UUID or similar string ID
    name = Column(String, index=True)
    type = Column(Enum(DishType), index=True)
    description = Column(String, nullable=True)
    price = Column(Float)
    kcals = Column(Integer, nullable=True)

    # Relationships to MenuEntry (one-to-many from Dish to MenuEntry main/alt/dessert/sopa)
    # This can get complex quickly. Often handled by querying MenuEntry and then loading Dish objects.
    # We won't define these backrefs here to keep the Dish model simple.

class MenuEntry(Base):
    __tablename__ = "menu_entries"

    id = Column(String(255), primary_key=True, index=True) # Assuming UUID or similar string ID
    date = Column(Date, index=True)
    meal_type = Column(Enum(MealType), index=True)
    notes = Column(String, nullable=True)

    # Foreign keys to Dish table
    main_dish_id = Column(String, ForeignKey("dishes.id"))
    alt_dish_id = Column(String, ForeignKey("dishes.id"), nullable=True)
    dessert_id = Column(String, ForeignKey("dishes.id"))
    sopa_id = Column(String, ForeignKey("dishes.id"), nullable=True)

    # Relationships to load associated Dish objects
    main_dish = relationship("Dish", foreign_keys=[main_dish_id])
    alt_dish = relationship("Dish", foreign_keys=[alt_dish_id])
    dessert = relationship("Dish", foreign_keys=[dessert_id])
    sopa = relationship("Dish", foreign_keys=[sopa_id])

    # Relationship back to DayMenu (one-to-one or one-to-many - structure suggests one-to-one/many based on date/meal_type)
    # This relationship is typically handled by querying DayMenu and loading MenuEntry.
    # We won't define it here.

# Note: WeeklyMenu and DayMenu structures are likely best managed in API logic
# by querying MenuEntry based on date ranges, rather than having dedicated DB tables
# unless there's specific metadata *per day* or *per week* to store beyond the entries themselves.
# The prompt description supports this approach by defining WeeklyMenu/DayMenu as compositions
# of MenuEntry, not necessarily separate database entities with complex relationships.