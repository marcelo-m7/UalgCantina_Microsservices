-- project/db/init/02_seeds.sql
use cantina_db;
go

INSERT INTO users (name, email, role) VALUES
    ('Marcelo Santos', 'marcelosouzasantos77@gmail.com', 'admin');
    
-- Insert sample data into the allergens table
INSERT INTO allergens (id, name, icon, description) VALUES
('allergen-gluten', 'Glúten', 'Wheat', 'Presente em cereais como trigo, cevada e centeio.'),
('allergen-lactose', 'Lactose', 'Milk', 'Açúcar encontrado no leite e derivados.'),
('allergen-peanuts', 'Amendoins', 'Nut', 'Um tipo comum de leguminosa alergênica.'),
('allergen-soy', 'Soja', 'Soybean', 'Presente em produtos de soja.'),
('allergen-nuts', 'Frutos Secos', 'Nut', 'Inclui amêndoas, nozes, castanhas, etc.');

-- Insert sample data into the dishes table
-- Assuming DishType enum values: 'carne', 'peixe', 'vegetariano', 'vegan', 'sobremesa', 'sopa', 'bebida'
INSERT INTO dishes (id, name, type, description, price, kcals) VALUES
('dish-lasanha-carne', 'Lasanha à Bolonhesa', 'carne', 'Deliciosa lasanha com molho de carne e bechamel.', 6.50, 700),
('dish-bacalhau-natas', 'Bacalhau com Natas', 'peixe', 'Prato tradicional de bacalhau gratinado.', 7.00, 650),
('dish-legumes-salteados', 'Legumes Salteados', 'vegetariano', 'Mix de legumes frescos salteados.', 5.50, 250),
('dish-curry-grao', 'Caril de Grão de Bico', 'vegan', 'Caril rico e saboroso com grão de bico.', 6.00, 550),
('dish-sopa-legumes', 'Sopa de Legumes', 'sopa', 'Sopa cremosa com vários legumes.', 2.50, 150),
('dish-sopa-peixe', 'Sopa de Peixe', 'sopa', 'Sopa rica com pedaços de peixe.', 3.00, 200),
('dish-mousse-chocolate', 'Mousse de Chocolate', 'sobremesa', 'Mousse fofa e intensa de chocolate.', 3.00, 400),
('dish-fruta-epoca', 'Fruta da Época', 'sobremesa', 'Fruta fresca variada.', 1.50, 80),
('dish-agua', 'Água 500ml', 'bebida', 'Água mineral sem gás.', 1.00, 0),
('dish-sumo-laranja', 'Sumo de Laranja Natural', 'bebida', 'Sumo natural de laranja espremida.', 2.00, 120);

-- Link dishes with allergens (sample entries for lasanha and bacalhau)
-- Lasanha com Gluten, Lactose
INSERT INTO dish_allergens (dish_id, allergen_id) VALUES
('dish-lasanha-carne', 'allergen-gluten'),
('dish-lasanha-carne', 'allergen-lactose');

-- Bacalhau com Natas com Lactose
INSERT INTO dish_allergens (dish_id, allergen_id) VALUES
('dish-bacalhau-natas', 'allergen-lactose');

-- Insert sample data into the weekly_menus table
-- Assuming a week starting today or a specific date
INSERT INTO weekly_menus (week_id, start_date, end_date) VALUES
('week-2023-W40', '2023-10-02', '2023-10-08'); -- Adjust dates as needed

-- Insert sample data into the day_menus table
INSERT INTO day_menus (date, weekly_menu_id) VALUES
('2023-10-02', 'week-2023-W40'), -- Monday
('2023-10-03', 'week-2023-W40'); -- Tuesday

-- Insert sample data into the menu_entries table (linking to dishes)
-- Assuming lunch for Monday (2023-10-02)
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes) VALUES
('menu-entry-2023-10-02-almoco', '2023-10-02', 'almoco', 'dish-lasanha-carne', 'dish-legumes-salteados', 'dish-mousse-chocolate', 'dish-sopa-legumes', 'Prato do dia: Lasanha à Bolonhesa');

-- Assuming dinner for Monday (2023-10-02)
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes) VALUES
('menu-entry-2023-10-02-jantar', '2023-10-02', 'jantar', 'dish-bacalhau-natas', 'dish-curry-grao', 'dish-fruta-epoca', 'dish-sopa-peixe', NULL);

-- Assuming lunch for Tuesday (2023-10-03)
INSERT INTO menu_entries (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes) VALUES
('menu-entry-2023-10-03-almoco', '2023-10-03', 'almoco', 'dish-curry-grao', 'dish-bacalhau-natas', 'dish-fruta-epoca', 'dish-sopa-legumes', 'Opção vegan: Caril de Grão');

-- You would add more entries for other days of the week and other weeks