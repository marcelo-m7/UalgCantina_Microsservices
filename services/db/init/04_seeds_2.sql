-- services/db/init/04_seeds.sql

USE cantina_db;
-- Semana 23: 2025-06-02 a 2025-06-08
INSERT INTO weekly_menus (week_id, start_date, end_date) VALUES 
('week-2025-W23', '2025-06-02', '2025-06-08');

-- Dias da semana 23
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id) VALUES
('menu-entry-2025-06-02-almoco', '2025-06-02', 'almoco', 'dish-lasanha', 'dish-vegetariano', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-02-jantar', '2025-06-02', 'jantar', 'dish-bacalhau', 'dish-vegan', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-03-almoco', '2025-06-03', 'almoco', 'dish-vegan', 'dish-carne', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-03-jantar', '2025-06-03', 'jantar', 'dish-peixe', 'dish-vegetariano', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-04-almoco', '2025-06-04', 'almoco', 'dish-carne', 'dish-vegan', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-04-jantar', '2025-06-04', 'jantar', 'dish-lasanha', 'dish-vegetariano', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-05-almoco', '2025-06-05', 'almoco', 'dish-peixe', 'dish-vegan', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-05-jantar', '2025-06-05', 'jantar', 'dish-carne', 'dish-vegetariano', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-06-almoco', '2025-06-06', 'almoco', 'dish-vegetariano', 'dish-vegan', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-06-jantar', '2025-06-06', 'jantar', 'dish-lasanha', 'dish-carne', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-07-almoco', '2025-06-07', 'almoco', 'dish-peixe', 'dish-vegetariano', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-07-jantar', '2025-06-07', 'jantar', 'dish-vegan', 'dish-carne', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-08-almoco', '2025-06-08', 'almoco', 'dish-lasanha', 'dish-vegan', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-08-jantar', '2025-06-08', 'jantar', 'dish-peixe', 'dish-vegetariano', 'dish-fruta', 'dish-sopa-peixe');

INSERT INTO day_menus (date, weekly_menu_id, lunch_entry_id, dinner_entry_id) VALUES
('2025-06-02', 'week-2025-W23', 'menu-entry-2025-06-02-almoco', 'menu-entry-2025-06-02-jantar'),
('2025-06-03', 'week-2025-W23', 'menu-entry-2025-06-03-almoco', 'menu-entry-2025-06-03-jantar'),
('2025-06-04', 'week-2025-W23', 'menu-entry-2025-06-04-almoco', 'menu-entry-2025-06-04-jantar'),
('2025-06-05', 'week-2025-W23', 'menu-entry-2025-06-05-almoco', 'menu-entry-2025-06-05-jantar'),
('2025-06-06', 'week-2025-W23', 'menu-entry-2025-06-06-almoco', 'menu-entry-2025-06-06-jantar'),
('2025-06-07', 'week-2025-W23', 'menu-entry-2025-06-07-almoco', 'menu-entry-2025-06-07-jantar'),
('2025-06-08', 'week-2025-W23', 'menu-entry-2025-06-08-almoco', 'menu-entry-2025-06-08-jantar');

-- Semana 24: 2025-06-09 a 2025-06-15
INSERT INTO weekly_menus (week_id, start_date, end_date) VALUES 
('week-2025-W24', '2025-06-09', '2025-06-15');

-- Dias da semana 24
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id) VALUES
('menu-entry-2025-06-09-almoco', '2025-06-09', 'almoco', 'dish-lasanha', 'dish-vegetariano', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-09-jantar', '2025-06-09', 'jantar', 'dish-bacalhau', 'dish-vegan', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-10-almoco', '2025-06-10', 'almoco', 'dish-vegan', 'dish-carne', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-10-jantar', '2025-06-10', 'jantar', 'dish-peixe', 'dish-vegetariano', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-11-almoco', '2025-06-11', 'almoco', 'dish-carne', 'dish-vegan', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-11-jantar', '2025-06-11', 'jantar', 'dish-lasanha', 'dish-vegetariano', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-12-almoco', '2025-06-12', 'almoco', 'dish-peixe', 'dish-vegan', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-12-jantar', '2025-06-12', 'jantar', 'dish-carne', 'dish-vegetariano', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-13-almoco', '2025-06-13', 'almoco', 'dish-vegetariano', 'dish-vegan', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-13-jantar', '2025-06-13', 'jantar', 'dish-lasanha', 'dish-carne', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-14-almoco', '2025-06-14', 'almoco', 'dish-peixe', 'dish-vegetariano', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-14-jantar', '2025-06-14', 'jantar', 'dish-vegan', 'dish-carne', 'dish-fruta', 'dish-sopa-peixe'),
('menu-entry-2025-06-15-almoco', '2025-06-15', 'almoco', 'dish-lasanha', 'dish-vegan', 'dish-mousse', 'dish-sopa-legumes'),
('menu-entry-2025-06-15-jantar', '2025-06-15', 'jantar', 'dish-peixe', 'dish-vegetariano', 'dish-fruta', 'dish-sopa-peixe');

INSERT INTO day_menus (date, weekly_menu_id, lunch_entry_id, dinner_entry_id) VALUES
('2025-06-09', 'week-2025-W24', 'menu-entry-2025-06-09-almoco', 'menu-entry-2025-06-09-jantar'),
('2025-06-10', 'week-2025-W24', 'menu-entry-2025-06-10-almoco', 'menu-entry-2025-06-10-jantar'),
('2025-06-11', 'week-2025-W24', 'menu-entry-2025-06-11-almoco', 'menu-entry-2025-06-11-jantar'),
('2025-06-12', 'week-2025-W24', 'menu-entry-2025-06-12-almoco', 'menu-entry-2025-06-12-jantar'),
('2025-06-13', 'week-2025-W24', 'menu-entry-2025-06-13-almoco', 'menu-entry-2025-06-13-jantar'),
('2025-06-14', 'week-2025-W24', 'menu-entry-2025-06-14-almoco', 'menu-entry-2025-06-14-jantar'),
('2025-06-15', 'week-2025-W24', 'menu-entry-2025-06-15-almoco', 'menu-entry-2025-06-15-jantar');
