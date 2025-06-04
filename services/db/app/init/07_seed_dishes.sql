-- 07_seed_dishes.sql
USE cantina_db;
SET NAMES utf8mb4;
START TRANSACTION;
SELECT '➡️  Seed 07_seed_dishes.sql iniciado' AS info;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Dia 2025-06-03 - almoço
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES (
  'menu-entry-2025-06-03-almoco', '2025-06-03', 'almoco',
  'dish-curry-grao', 'dish-bacalhau-natas',
  'dish-fruta-epoca', 'dish-sopa-legumes',
  'Opção vegan: Caril de Grão'
);

UPDATE day_menus
SET lunch_entry_id = 'menu-entry-2025-06-03-almoco'
WHERE date = '2025-06-03';

-- Dia 2025-06-04 - almoço
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES (
  'menu-entry-2025-06-04-almoco', '2025-06-04', 'almoco',
  'dish-lasanha-carne', 'dish-legumes-salteados',
  'dish-mousse-chocolate', 'dish-sopa-legumes',
  'Prato do dia: Lasanha à Bolonhesa'
);

UPDATE day_menus
SET lunch_entry_id = 'menu-entry-2025-06-04-almoco'
WHERE date = '2025-06-04';

-- Dia 2025-06-05 - almoço
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES (
  'menu-entry-2025-06-05-almoco', '2025-06-05', 'almoco',
  'dish-bacalhau-natas', 'dish-curry-grao',
  'dish-fruta-epoca', 'dish-sopa-peixe',
  'Sabor do mar: Bacalhau com Natas'
);

UPDATE day_menus
SET lunch_entry_id = 'menu-entry-2025-06-05-almoco'
WHERE date = '2025-06-05';

-- Dia 2025-06-06 - almoço
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES (
  'menu-entry-2025-06-06-almoco', '2025-06-06', 'almoco',
  'dish-legumes-salteados', 'dish-lasanha-carne',
  'dish-mousse-chocolate', 'dish-sopa-legumes',
  'Prato vegetariano leve'
);

UPDATE day_menus
SET lunch_entry_id = 'menu-entry-2025-06-06-almoco'
WHERE date = '2025-06-06';

-- Dia 2025-06-07 - almoço
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES (
  'menu-entry-2025-06-07-almoco', '2025-06-07', 'almoco',
  'dish-curry-grao', 'dish-bacalhau-natas',
  'dish-fruta-epoca', 'dish-sopa-legumes',
  'Almoço com opção vegan'
);

UPDATE day_menus
SET lunch_entry_id = 'menu-entry-2025-06-07-almoco'
WHERE date = '2025-06-07';

-- Dia 2025-06-08 - almoço
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES (
  'menu-entry-2025-06-08-almoco', '2025-06-08', 'almoco',
  'dish-lasanha-carne', 'dish-legumes-salteados',
  'dish-mousse-chocolate', 'dish-sopa-peixe',
  'Fechando a semana com sabor'
);

UPDATE day_menus
SET lunch_entry_id = 'menu-entry-2025-06-08-almoco'
WHERE date = '2025-06-08';


SET FOREIGN_KEY_CHECKS = 1;
/* ------------------------------------------------------------------------- */
COMMIT;
SELECT '✅ Seed 07_seed_dishes.sql concluído' AS info;
