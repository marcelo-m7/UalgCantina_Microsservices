-- services/db/init/04_seeds.sql

USE cantina_db;

-- Inserção de pratos
INSERT INTO dishes (id, name, `type`, description, price, kcals) VALUES ('dish-sopa-chuchu-feijao', 'Sopa de chuchu e feijão vermelho', 'sopa', 'Sopa leve e nutritiva com chuchu e feijão.', 2.5, 120)
INSERT INTO dishes (id, name, `type`, description, price, kcals) VALUES ('dish-frango-legumes', 'Salteado de frango com legumes', 'carne', 'Frango salteado com legumes e massa fusilli.', 6.5, 700)
INSERT INTO dishes (id, name, `type`, description, price, kcals) VALUES ('dish-calamares-tomate', 'Calamares à Romana com arroz de tomate', 'peixe', 'Calamares crocantes com arroz de tomate.', 7.0, 680)
INSERT INTO dishes (id, name, `type`, description, price, kcals) VALUES ('dish-moqueca-tofu', 'Moqueca de tofu com arroz branco', 'vegan', 'Moqueca vegana rica em sabor.', 6.0, 600)
INSERT INTO dishes (id, name, `type`, description, price, kcals) VALUES ('dish-fruta', 'Fruta', 'sobremesa', 'Fruta fresca da época.', 1.5, 80)

-- Inserção do menu semanal
INSERT INTO weekly_menus (week_id, start_date, end_date) VALUES ('week-2025-W23', '2025-06-03', '2025-06-09')

-- Inserção do menu diário
INSERT INTO day_menus (date, weekly_menu_id, lunch_entry_id, dinner_entry_id) VALUES ('2025-06-03', 'week-2025-W23', NULL, NULL)

-- Inserção de entrada de almoço
INSERT INTO menu_entries (id, `date`, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes) VALUES ('menu-entry-2025-06-03-almoco', '2025-06-03', 'almoco', 'dish-frango-legumes', 'dish-calamares-tomate', 'dish-fruta', 'dish-sopa-chuchu-feijao', 'Inclui opção vegan: Moqueca de tofu com arroz branco.')

-- Atualização do menu diário
UPDATE day_menus SET lunch_entry_id = 'menu-entry-2025-06-03-almoco' WHERE date = '2025-06-03'

