-- init.sql : CantinaCast MySQL schema and seed data
-- Generated on 2025-05-30T16:00:36Z
SET NAMES utf8mb4;
SET time_zone = '+00:00';

DROP DATABASE IF EXISTS ementas;
CREATE DATABASE ementas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ementas;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin','editor') NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `allergens`
-- -----------------------------------------------------
CREATE TABLE allergens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    description VARCHAR(255)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `dishes`
-- -----------------------------------------------------
CREATE TABLE dishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(140) NOT NULL,
    type ENUM('carne','peixe','vegetariano','vegan','sobremesa','sopa','bebida') NOT NULL,
    description TEXT,
    price DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    kcals INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `dish_allergen` (many-to-many)
-- -----------------------------------------------------
CREATE TABLE dish_allergen (
    dish_id INT NOT NULL,
    allergen_id INT NOT NULL,
    PRIMARY KEY (dish_id, allergen_id),
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    FOREIGN KEY (allergen_id) REFERENCES allergens(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `weeks`
-- -----------------------------------------------------
CREATE TABLE weeks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    week_id VARCHAR(8) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `day_menus`
-- -----------------------------------------------------
CREATE TABLE day_menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    week_id INT NOT NULL,
    date DATE NOT NULL UNIQUE,
    FOREIGN KEY (week_id) REFERENCES weeks(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `menu_entries`
-- Each DayMenu can have 0-2 entries (lunch, dinner)
-- -----------------------------------------------------
CREATE TABLE menu_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_menu_id INT NOT NULL,
    meal_type ENUM('lunch','dinner') NOT NULL,
    sopa_id INT,
    main_dish_id INT NOT NULL,
    alt_dish_id INT,
    dessert_id INT,
    notes VARCHAR(255),
    FOREIGN KEY (day_menu_id) REFERENCES day_menus(id) ON DELETE CASCADE,
    FOREIGN KEY (sopa_id) REFERENCES dishes(id) ON DELETE SET NULL,
    FOREIGN KEY (main_dish_id) REFERENCES dishes(id) ON DELETE RESTRICT,
    FOREIGN KEY (alt_dish_id) REFERENCES dishes(id) ON DELETE SET NULL,
    FOREIGN KEY (dessert_id) REFERENCES dishes(id) ON DELETE SET NULL,
    UNIQUE KEY uk_daymenu_meal (day_menu_id, meal_type)
) ENGINE=InnoDB;