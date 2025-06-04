-- services/db/init/02_tables.sql

USE cantina_db;

-- 1) Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin','editor') NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2) Tabela de alergênicos (allergens)
CREATE TABLE IF NOT EXISTS allergens (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(255),
    description TEXT
);

-- 3) Tabela de pratos (dishes)
CREATE TABLE IF NOT EXISTS dishes (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    kcals INT
);

-- 4) Tabela de ligação many-to-many entre dishes e allergens
CREATE TABLE IF NOT EXISTS dish_allergens (
    dish_id VARCHAR(255) NOT NULL,
    allergen_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (dish_id, allergen_id),
    FOREIGN KEY (dish_id) REFERENCES dishes(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (allergen_id) REFERENCES allergens(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5) Tabela de entradas de menu de cada dia (menu_entries)
CREATE TABLE IF NOT EXISTS menu_entries (
    id VARCHAR(255) PRIMARY KEY,
    date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    main_dish_id VARCHAR(255) NOT NULL,
    alt_dish_id VARCHAR(255),
    dessert_id VARCHAR(255) NOT NULL,
    sopa_id VARCHAR(255),
    notes TEXT,
    UNIQUE KEY unique_date_meal (date, meal_type),
    FOREIGN KEY (main_dish_id) REFERENCES dishes(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (alt_dish_id) REFERENCES dishes(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (dessert_id) REFERENCES dishes(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (sopa_id) REFERENCES dishes(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 6) Tabela de menus semanais (weekly_menus)
CREATE TABLE IF NOT EXISTS weekly_menus (
    week_id VARCHAR(255) PRIMARY KEY,
    start_date DATE NOT NULL UNIQUE,
    end_date DATE NOT NULL
);

-- 7) Tabela de menus diários vinculados ao menu semanal (day_menus)
CREATE TABLE IF NOT EXISTS day_menus (
    date DATE PRIMARY KEY,
    weekly_menu_id VARCHAR(255) NOT NULL,
    lunch_entry_id VARCHAR(255),
    dinner_entry_id VARCHAR(255),
    FOREIGN KEY (weekly_menu_id) REFERENCES weekly_menus(week_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (lunch_entry_id) REFERENCES menu_entries(id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (dinner_entry_id) REFERENCES menu_entries(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
);
