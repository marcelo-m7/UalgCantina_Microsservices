USE cantina_db;

/* ---------- 1. Usuários (exemplo) ------------------------------- */
INSERT INTO users (name, email, role)
VALUES ('Admin Demo', 'admin@example.com', 'admin');

/* ---------- 2. Alergênicos -------------------------------------- */
INSERT INTO allergens (id, name, icon, description) VALUES
  ('alerg-gluten',  'Glúten',  'wheat', 'Contém derivados de trigo'),
  ('alerg-lactose', 'Lactose', 'milk',  'Contém leite ou derivados'),
  ('alerg-ovos',    'Ovos',    'egg',   'Contém ovos'),
  ('alerg-nozes',   'Nozes',   'nut',   'Contém frutos de casca rija');

/* ---------- 3. Pratos (dishes) ---------------------------------- */
INSERT INTO dishes (id, name, type, description, price, kcals) VALUES
  ('dish-frango',  'Frango grelhado',     'carne',       'Peito de frango grelhado',          6.50, 450),
  ('dish-peixe',   'Dourada grelhada',    'peixe',       'Filete de dourada com limão',       7.20, 380),
  ('dish-lasveg',  'Lasanha vegetariana', 'vegetariano', 'Lasanha de legumes',               6.80, 520),
  ('dish-sopa',    'Sopa de legumes',     'sopa',        'Sopa cremosa de legumes',           2.00, 120),
  ('dish-fruta',   'Salada de frutas',    'sobremesa',   'Frutas frescas da estação',         2.50, 160);

/* ---------- 4. Relação prato ↔ alérgeno ------------------------- */
INSERT INTO dish_allergens (dish_id, allergen_id) VALUES
  ('dish-lasveg', 'alerg-gluten'),
  ('dish-lasveg', 'alerg-lactose'),
  ('dish-sopa',   'alerg-gluten');

/* ---------- 5. Menu semanal (02–08 jun 2025) -------------------- */
INSERT INTO weekly_menus (week_id, start_date, end_date)
VALUES ('2025-W23', '2025-06-02', '2025-06-08');

/* ---------- 6. Menu entries (02/jun) ---------------------------- */
INSERT INTO menu_entries
  (id, date, meal_type, main_dish_id, alt_dish_id, dessert_id, sopa_id, notes)
VALUES
  ('entry-20250602-alm', '2025-06-02', 'almoco',
   'dish-frango', 'dish-lasveg', 'dish-fruta', 'dish-sopa', NULL),
  ('entry-20250602-jan', '2025-06-02', 'jantar',
   'dish-peixe',  NULL,          'dish-fruta', 'dish-sopa', NULL);

/* ---------- 7. Day menu ligando almoço e jantar ---------------- */
INSERT INTO day_menus
  (date,       weekly_menu_id, lunch_entry_id,        dinner_entry_id)
VALUES
  ('2025-06-02','2025-W23',    'entry-20250602-alm',  'entry-20250602-jan');