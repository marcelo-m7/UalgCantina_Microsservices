from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey, Table, Boolean, Text
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
import config

engine = create_engine(config.DB_URL)
Base = declarative_base()

# Helper table for many-to-many relationship between Dish and Allergen
dish_allergen_association = Table('dish_allergen', Base.metadata,
    Column('dish_id', Integer, ForeignKey('dishes.id')),
    Column('allergen_id', Integer, ForeignKey('allergens.id'))
)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), default='editor') # admin, editor

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role
        }

class Allergen(Base):
    __tablename__ = 'allergens'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text)

    dishes = relationship("Dish", secondary=dish_allergen_association, back_populates="allergens")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }

class Dish(Base):
    __tablename__ = 'dishes'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    is_vegetarian = Column(Boolean, default=False)

    allergens = relationship("Allergen", secondary=dish_allergen_association, back_populates="dishes")
    menu_entries = relationship("MenuEntry", back_populates="dish")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_vegetarian": self.is_vegetarian,
            "allergens": [a.to_dict() for a in self.allergens]
        }


class Week(Base):
    __tablename__ = 'weeks'
    id = Column(Integer, primary_key=True)
    year = Column(Integer, nullable=False)
    week_number = Column(Integer, nullable=False)

    day_menus = relationship("DayMenu", back_populates="week")

    def to_dict(self):
        return {
            "id": self.id,
            "year": self.year,
            "week_number": self.week_number
        }


class DayMenu(Base):
    __tablename__ = 'day_menus'
    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    week_id = Column(Integer, ForeignKey('weeks.id'))

    week = relationship("Week", back_populates="day_menus")
    menu_entries = relationship("MenuEntry", back_populates="day_menu")

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat() if self.date else None,
            "week_id": self.week_id,
            "menu_entries": [me.to_dict() for me in self.menu_entries]
        }

class MenuEntry(Base):
    __tablename__ = 'menu_entries'
    id = Column(Integer, primary_key=True)
    day_menu_id = Column(Integer, ForeignKey('day_menus.id'))
    dish_id = Column(Integer, ForeignKey('dishes.id'))
    meal_type = Column(String(50)) # e.g., "Lunch", "Dinner"
    price = Column(Text) # Store as text to allow for variations like "€2.50", "Free"

    day_menu = relationship("DayMenu", back_populates="menu_entries")
    dish = relationship("Dish", back_populates="menu_entries")

    def to_dict(self):
        return {
            "id": self.id,
            "day_menu_id": self.day_menu_id,
            "dish_id": self.dish_id,
            "meal_type": self.meal_type,
            "price": self.price,
            "dish": self.dish.to_dict() if self.dish else None
        }


if __name__ == '__main__':
    Base.metadata.create_all(engine)