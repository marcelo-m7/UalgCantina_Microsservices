-- services/db/init/02_seeds.sql
-- USE cantina_db;

-- Desliga verificações para evitar erros de FK durante o seed
SET FOREIGN_KEY_CHECKS = 0;

/* ----------------------------------------------------------------------
   1) Utilizadores
   -------------------------------------------------------------------- */
INSERT INTO users (name, email, role)
VALUES
  ('Marcelo Santos', 'marcelosouzasantos77@gmail.com', 'admin');

/* ----------------------------------------------------------------------
   2) Alergénicos
   -------------------------------------------------------------------- */
INSERT INTO allergens (id, name, icon, description)
VALUES
  ('allergen-gluten',  'Glúten',          'Wheat',   'Presente em cereais como trigo, cevada e centeio.'),
  ('allergen-lactose', 'Lactose',         'Milk',    'Açúcar encontrado no leite e derivados.'),
  ('allergen-peanuts', 'Amendoins',       'Nut',     'Um tipo comum de leguminosa alergênica.'),
  ('allergen-soy',     'Soja',            'Soybean', 'Presente em produtos de soja.'),
  ('allergen-nuts',    'Frutos Secos',    'Nut',     'Inclui amêndoas, nozes, castanhas, etc.');

/* ----------------------------------------------------------------------
   3) Pratos
   -------------------------------------------------------------------- */
INSERT INTO dishes (id, name, `type`, description, price, kcals)
VALUES
  ('dish-lasanha-carne',   'Lasanha à Bolonhesa',       'carne',       'Deliciosa lasanha com molho de carne e bechamel.', 6.50, 700),
  ('dish-bacalhau-natas',  'Bacalhau com Natas',        'peixe',       'Prato tradicional de bacalhau gratinado.',         7.00, 650),
  ('dish-legumes-salteados','Legumes Salteados',        'vegetariano', 'Mix de legumes frescos salteados.',                5.50, 250),
  ('dish-curry-grao',      'Caril de Grão de Bico',     'vegan',       'Caril rico e saboroso com grão de bico.',          6.00, 550),
  ('dish-sopa-legumes',    'Sopa de Legumes',           'sopa',        'Sopa cremosa com vários legumes.',                 2.50, 150),
  ('dish-sopa-peixe',      'Sopa de Peixe',             'sopa',        'Sopa rica com pedaços de peixe.',                  3.00, 200),
  ('dish-mousse-chocolate','Mousse de Chocolate',       'sobremesa',   'Mousse fofa e intensa de chocolate.',              3.00, 400),
  ('dish-fruta-epoca',     'Fruta da Época',            'sobremesa',   'Fruta fresca variada.',                            1.50, 80),
  ('dish-agua',            'Água 500 ml',               'bebida',      'Água mineral sem gás.',                            1.00, 0),
  ('dish-sumo-laranja',    'Sumo de Laranja Natural',   'bebida',      'Sumo natural de laranja espremida.',              2.00, 120);

/* ----------------------------------------------------------------------
   4) Relação pratos × alergénicos
   -------------------------------------------------------------------- */
INSERT INTO dish_allergens (dish_id, allergen_id)
VALUES
  ('dish-lasanha-carne',  'allergen-gluten'),
  ('dish-lasanha-carne',  'allergen-lactose'),
  ('dish-bacalhau-natas', 'allergen-lactose');

/* ----------------------------------------------------------------------
   5) Menus semanais
   -------------------------------------------------------------------- */
INSERT INTO weekly_menus (week_id, start_date, end_date)
VALUES
  ('week-2023-W40', '2023-10-02', '2023-10-08');

/* ----------------------------------------------------------------------
   6) Menus diários (ainda sem refeições atribuídas)
   -------------------------------------------------------------------- */
INSERT INTO day_menus ( `date`, weekly_menu_id, lunch_entry_id, dinner_entry_id )
VALUES
  ('2023-10-02', 'week-2023-W40', NULL, NULL),
  ('2023-10-03', 'week-2023-W40', NULL, NULL);

/* ----------------------------------------------------------------------
   7) Entradas de menu (almoço/jantar)
   -------------------------------------------------------------------- */
INSERT INTO menu_entries
  (id, `date`, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES
  ('menu-entry-2023-10-02-almoco', '2023-10-02', 'almoco',
   'dish-lasanha-carne', 'dish-legumes-salteados',
   'dish-mousse-chocolate', 'dish-sopa-legumes',
   'Prato do dia: Lasanha à Bolonhesa'),

  ('menu-entry-2023-10-02-jantar', '2023-10-02', 'jantar',
   'dish-bacalhau-natas', 'dish-curry-grao',
   'dish-fruta-epoca', 'dish-sopa-peixe', NULL),

  ('menu-entry-2023-10-03-almoco', '2023-10-03', 'almoco',
   'dish-curry-grao', 'dish-bacalhau-natas',
   'dish-fruta-epoca', 'dish-sopa-legumes',
   'Opção vegan: Caril de Grão');

/* ----------------------------------------------------------------------
   8) Actualiza day_menus com as entradas criadas
   -------------------------------------------------------------------- */
UPDATE day_menus
SET
  lunch_entry_id  = 'menu-entry-2023-10-02-almoco',
  dinner_entry_id = 'menu-entry-2023-10-02-jantar'
WHERE `date` = '2023-10-02';

UPDATE day_menus
SET
  lunch_entry_id = 'menu-entry-2023-10-03-almoco'
WHERE `date` = '2023-10-03';

/* ----------------------------------------------------------------------
   9) Reactiva verificações de FK
   -------------------------------------------------------------------- */
SET FOREIGN_KEY_CHECKS = 1;
