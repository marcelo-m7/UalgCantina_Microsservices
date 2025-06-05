-- 06_seed_dishes.sql
USE cantina_db;
SET NAMES utf8mb4;
START TRANSACTION;
SELECT '➡️  Seed 06_seed_dishes.sql iniciado' AS info;
/* ------------------------------------------------------------------------- */
/*  Ficheiro: 10_seed_dishes.sql                                             */
/*  Objectivo: popular a tabela `dishes` (e relacionar alergénios)           */
/*  Encoding:  UTF-8 (sem BOM)                                               */
/* ------------------------------------------------------------------------- */

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

/*---------------------------------------------------------------------------
  1) Alergénios básicos  (IGNORA se já existirem)
---------------------------------------------------------------------------*/
INSERT IGNORE INTO allergens (id, name, icon, description) VALUES
  ('allergen-gluten',   'Glúten',        'Wheat',  'Presente em cereais como trigo, cevada e centeio.'),
  ('allergen-lactose',  'Lactose',       'Milk',   'Açúcar natural do leite e derivados.'),
  ('allergen-ovo',      'Ovo',           'Egg',    'Proteína do ovo de galinha e derivados.'),
  ('allergen-soja',     'Soja',          'Soybean','Soja e produtos à base de soja.'),
  ('allergen-peixe',    'Peixe',         'Fish',   'Qualquer espécie de peixe e produtos derivados.'),
  ('allergen-frutos-secos','Frutos Secos','Nut',   'Amêndoas, nozes, avelãs, etc.');

/*---------------------------------------------------------------------------
  2) Pratos  (ON DUPLICATE para evitar erro caso já existam)
---------------------------------------------------------------------------*/
INSERT IGNORE INTO dishes (id, name, `type`, description, price, kcals) VALUES
  -- Carnes
  ('dish-feijoada-porco',   'Feijoada à Transmontana', 'carne',
     'Feijoada tradicional de feijão branco com enchidos e carne de porco.', 6.90, 780),
  ('dish-bitoque-vaca',     'Bitoque de Vaca',         'carne',
     'Bife de vaca grelhado, ovo a cavalo e batata frita.',                  7.20, 650),

  -- Peixes
  ('dish-pescada-cozida',   'Pescada Cozida',          'peixe',
     'Filete de pescada cozida com legumes cozidos.',                        6.50, 420),
  ('dish-salmao-grelhado',  'Salmão Grelhado',         'peixe',
     'Lombo de salmão grelhado, molho de limão e ervas.',                    8.00, 480),

  -- Vegetarianos / Vegan
  ('dish-strogonoff-soja',  'Strogonoff de Soja',      'vegetariano',
     'Strogonoff cremoso preparado com tiras de soja.',                      6.00, 520),
  ('dish-curry-grao',       'Caril de Grão',           'vegan',
     'Caril aromático de grão-de-bico, legumes e leite de coco.',            6.00, 540),

  -- Sopas
  ('dish-sopa-espinafres',  'Sopa de Espinafres',      'sopa',
     'Creme suave de espinafres frescos.',                                   2.20, 110),
  ('dish-sopa-peixe',       'Sopa de Peixe',           'sopa',
     'Sopa rica preparada com caldo de peixe e hortaliças.',                 2.80, 180),

  -- Sobremesas
  ('dish-mousse-chocolate', 'Mousse de Chocolate',     'sobremesa',
     'Mousse caseira de chocolate negro.',                                   2.50, 390),
  ('dish-fruta-epoca',      'Fruta da Época',          'sobremesa',
     'Selecção diária de fruta fresca.',                                     1.20,  90),

  -- Bebidas
  ('dish-agua',            'Água 500 ml',              'bebida',
     'Água mineral natural sem gás (garrafa 0,5 L).',                        1.00,   0),
  ('dish-sumo-laranja',    'Sumo de Laranja Natural',  'bebida',
     'Sumo de laranja espremido na hora (copo 25 cl).',                      2.00, 120)
ON DUPLICATE KEY UPDATE
  name        = VALUES(name),
  type        = VALUES(type),
  description = VALUES(description),
  price       = VALUES(price),
  kcals       = VALUES(kcals);

/*---------------------------------------------------------------------------
  3) Ligações prato × alergénio  (IGNORA duplicados)
---------------------------------------------------------------------------*/
INSERT IGNORE INTO dish_allergens (dish_id, allergen_id) VALUES
  -- Feijoada: contém glúten e frutos secos (enchidos)
  ('dish-feijoada-porco', 'allergen-gluten'),
  ('dish-feijoada-porco', 'allergen-frutos-secos'),

  -- Bitoque: contém ovo
  ('dish-bitoque-vaca',   'allergen-ovo'),

  -- Pescada & Salmão: contêm peixe
  ('dish-pescada-cozida', 'allergen-peixe'),
  ('dish-salmao-grelhado','allergen-peixe'),

  -- Strogonoff de Soja: contém soja e lactose
  ('dish-strogonoff-soja','allergen-soja'),
  ('dish-strogonoff-soja','allergen-lactose'),

  -- Mousse de Chocolate: contém lactose e ovo
  ('dish-mousse-chocolate','allergen-lactose'),
  ('dish-mousse-chocolate','allergen-ovo')
;

SET FOREIGN_KEY_CHECKS = 1;
/* ------------------------------------------------------------------------- */
COMMIT;
SELECT '✅ Seed 06_seed_dishes.sql concluído' AS info;
