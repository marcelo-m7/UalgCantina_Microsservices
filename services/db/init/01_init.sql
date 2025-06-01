-- services/db/init/01_init.sql

-- Database initialization scripts can go here.
-- For example, you could add INSERT statements for initial data.
-- This file is executed by the PostgreSQL Docker image entrypoint.

-- Create the database
CREATE DATABASE IF NOT EXISTS cantina_db;

-- Switch to the database
USE cantina_db;

-- Create the user and grant privileges
CREATE USER IF NOT EXISTS 'cantina_user'@'%' IDENTIFIED BY 'senhaSegura123';
GRANT ALL PRIVILEGES ON cantina_db.* TO 'cantina_user'@'%';

-- Optional: Flush privileges to apply changes immediately
FLUSH PRIVILEGES;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin','editor') NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) 

-- Create the allergens table
CREATE TABLE allergens (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(255),
    description TEXT
);

-- Create the dishes table
-- DishType enum equivalent using CHECK constraint
CREATE TABLE dishes (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('carne', 'peixe', 'vegetariano', 'vegan', 'sobremesa', 'sopa', 'bebida')) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    kcals INTEGER,
    -- allergen_ids are stored in a many-to-many relationship table or an array field
    -- For simplicity here, let's just create the main dishes table.
    -- A separate table for dish-allergen relationships would be more robust.
    -- For now, we'll omit allergen_ids in the SQL schema and rely on the ORM
    -- to handle relationships or use a separate table.
);

-- Create a linking table for many-to-many relationship between dishes and allergens
CREATE TABLE dish_allergens (
    dish_id VARCHAR(255) REFERENCES dishes(id) ON DELETE CASCADE,
    allergen_id VARCHAR(255) REFERENCES allergens(id) ON DELETE CASCADE,
    PRIMARY KEY (dish_id, allergen_id)
);

-- Create the menu_entries table
CREATE TABLE menu_entries (
    id VARCHAR(255) PRIMARY KEY,
    date DATE NOT NULL,
    meal_type VARCHAR(50) CHECK (meal_type IN ('almoco', 'jantar')) NOT NULL,
    main_dish_id VARCHAR(255) REFERENCES dishes(id),
    alt_dish_id VARCHAR(255) REFERENCES dishes(id),
    dessert_id VARCHAR(255) REFERENCES dishes(id),
    sopa_id VARCHAR(255) REFERENCES dishes(id),
    notes TEXT,
    UNIQUE (date, meal_type) -- Ensure only one entry per date and meal type
);

-- Create the day_menus table
-- This table structure might be redundant if menu_entries already stores date and meal_type
-- based on the Python models provided, the structure suggests DayMenu is a container for MenuEntry
-- Let's create it to reflect the Python model structure, although a single menu_entries table might suffice
CREATE TABLE day_menus (
    date DATE PRIMARY KEY,
    lunch_entry_id VARCHAR(255) REFERENCES menu_entries(id) ON DELETE SET NULL,
    dinner_entry_id VARCHAR(255) REFERENCES menu_entries(id) ON DELETE SET NULL
);

-- Create the weekly_menus table
-- Based on the Python models, WeeklyMenu contains DayMenu objects
-- This might be more about representation in the backend than a direct DB table structure
-- However, let's create a table to represent weeks, linking to day_menus
CREATE TABLE weekly_menus (
    week_id VARCHAR(255) PRIMARY KEY,
    start_date DATE NOT NULL UNIQUE, -- Assuming one weekly menu per start date
    end_date DATE NOT NULL
);

-- A linking table for weekly_menus and day_menus if needed,
-- but the Python model implies weekly_menus just contains day_menus based on date range.
-- We'll omit a linking table for now and rely on querying day_menus within a date range
-- to construct WeeklyMenu in the backend.