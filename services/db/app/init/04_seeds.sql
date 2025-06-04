-- services/db/init/03_seeds.sql

USE cantina_db;

-- Desliga verificações para evitar erros de FK durante o seed
SET FOREIGN_KEY_CHECKS = 0;

/* ----------------------------------------------------------------------
   1) Utilizadores
   -------------------------------------------------------------------- */
INSERT IGNORE INTO users (name, email, role)
VALUES
  ('Marcelo Santos', 'marcelosouzasantos77@gmail.com', 'admin');

/* ----------------------------------------------------------------------
   2) Alergénicos
   -------------------------------------------------------------------- */

-- Semana week-2025-W40
INSERT IGNORE INTO weekly_menus (week_id, start_date, end_date)
VALUES ('week-2025-W40', '2025-06-02', '2025-06-08')
ON DUPLICATE KEY UPDATE start_date = VALUES(start_date), end_date = VALUES(end_date);

-- Entradas de menu

-- Monday 2025-06-02 - Almoço
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES ('menu-entry-2025-06-02-almoco', '2025-06-02', 'almoco', 'dish-lasanha-carne', 'dish-legumes-salteados', 'dish-mousse-chocolate', 'dish-sopa-legumes', 'Menu automático');

-- Monday 2025-06-02 - Jantar
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id)
VALUES ('menu-entry-2025-06-02-jantar', '2025-06-02', 'jantar', 'dish-legumes-salteados', 'dish-lasanha-carne', 'dish-mousse-chocolate', 'dish-sopa-legumes');

-- Tuesday 2025-06-03 - Almoço
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES ('menu-entry-2025-06-03-almoco', '2025-06-03', 'almoco', 'dish-lasanha-carne', 'dish-legumes-salteados', 'dish-mousse-chocolate', 'dish-sopa-legumes', 'Menu automático');

-- Tuesday 2025-06-03 - Jantar
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id)
VALUES ('menu-entry-2025-06-03-jantar', '2025-06-03', 'jantar', 'dish-legumes-salteados', 'dish-lasanha-carne', 'dish-mousse-chocolate', 'dish-sopa-legumes');

-- Wednesday 2025-06-04 - Almoço
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES ('menu-entry-2025-06-04-almoco', '2025-06-04', 'almoco', 'dish-lasanha-carne', 'dish-legumes-salteados', 'dish-mousse-chocolate', 'dish-sopa-legumes', 'Menu automático');

-- Wednesday 2025-06-04 - Jantar
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id)
VALUES ('menu-entry-2025-06-04-jantar', '2025-06-04', 'jantar', 'dish-legumes-salteados', 'dish-lasanha-carne', 'dish-mousse-chocolate', 'dish-sopa-legumes');

-- Thursday 2025-06-05 - Almoço
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES ('menu-entry-2025-06-05-almoco', '2025-06-05', 'almoco', 'dish-lasanha-carne', 'dish-legumes-salteados', 'dish-mousse-chocolate', 'dish-sopa-legumes', 'Menu automático');

-- Thursday 2025-06-05 - Jantar
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id)
VALUES ('menu-entry-2025-06-05-jantar', '2025-06-05', 'jantar', 'dish-legumes-salteados', 'dish-lasanha-carne', 'dish-mousse-chocolate', 'dish-sopa-legumes');

-- Friday 2025-06-06 - Almoço
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES ('menu-entry-2025-06-06-almoco', '2025-06-06', 'almoco', 'dish-lasanha-carne', 'dish-legumes-salteados', 'dish-mousse-chocolate', 'dish-sopa-legumes', 'Menu automático');

-- Friday 2025-06-06 - Jantar
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id)
VALUES ('menu-entry-2025-06-06-jantar', '2025-06-06', 'jantar', 'dish-legumes-salteados', 'dish-lasanha-carne', 'dish-mousse-chocolate', 'dish-sopa-legumes');

-- Saturday 2025-06-07 - Almoço
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES ('menu-entry-2025-06-07-almoco', '2025-06-07', 'almoco', 'dish-lasanha-carne', 'dish-legumes-salteados', 'dish-mousse-chocolate', 'dish-sopa-legumes', 'Menu automático');

-- Saturday 2025-06-07 - Jantar
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id)
VALUES ('menu-entry-2025-06-07-jantar', '2025-06-07', 'jantar', 'dish-legumes-salteados', 'dish-lasanha-carne', 'dish-mousse-chocolate', 'dish-sopa-legumes');

-- Sunday 2025-06-08 - Almoço
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES ('menu-entry-2025-06-08-almoco', '2025-06-08', 'almoco', 'dish-lasanha-carne', 'dish-legumes-salteados', 'dish-mousse-chocolate', 'dish-sopa-legumes', 'Menu automático');

-- Sunday 2025-06-08 - Jantar
INSERT IGNORE INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id)
VALUES ('menu-entry-2025-06-08-jantar', '2025-06-08', 'jantar', 'dish-legumes-salteados', 'dish-lasanha-carne', 'dish-mousse-chocolate', 'dish-sopa-legumes');


-- Relacionamento dia <-> menu

-- Monday 2025-06-02
INSERT IGNORE INTO day_menus (date, weekly_menu_id, lunch_entry_id, dinner_entry_id)
VALUES ('2025-06-02', 'week-2025-W40', 'menu-entry-2025-06-02-almoco', 'menu-entry-2025-06-02-jantar');

-- Tuesday 2025-06-03
INSERT IGNORE INTO day_menus (date, weekly_menu_id, lunch_entry_id, dinner_entry_id)
VALUES ('2025-06-03', 'week-2025-W40', 'menu-entry-2025-06-03-almoco', 'menu-entry-2025-06-03-jantar');

-- Wednesday 2025-06-04
INSERT IGNORE INTO day_menus (date, weekly_menu_id, lunch_entry_id, dinner_entry_id)
VALUES ('2025-06-04', 'week-2025-W40', 'menu-entry-2025-06-04-almoco', 'menu-entry-2025-06-04-jantar');

-- Thursday 2025-06-05
INSERT IGNORE INTO day_menus (date, weekly_menu_id, lunch_entry_id, dinner_entry_id)
VALUES ('2025-06-05', 'week-2025-W40', 'menu-entry-2025-06-05-almoco', 'menu-entry-2025-06-05-jantar');

-- Friday 2025-06-06
INSERT IGNORE INTO day_menus (date, weekly_menu_id, lunch_entry_id, dinner_entry_id)
VALUES ('2025-06-06', 'week-2025-W40', 'menu-entry-2025-06-06-almoco', 'menu-entry-2025-06-06-jantar');

-- Saturday 2025-06-07
INSERT IGNORE INTO day_menus (date, weekly_menu_id, lunch_entry_id, dinner_entry_id)
VALUES ('2025-06-07', 'week-2025-W40', 'menu-entry-2025-06-07-almoco', 'menu-entry-2025-06-07-jantar');

-- Sunday 2025-06-08
INSERT IGNORE INTO day_menus (date, weekly_menu_id, lunch_entry_id, dinner_entry_id)
VALUES ('2025-06-08', 'week-2025-W40', 'menu-entry-2025-06-08-almoco', 'menu-entry-2025-06-08-jantar');

