USE cantina;

INSERT IGNORE INTO alergenos (nome) VALUES
  ('Glúten'),
  ('Lácteos'),
  ('Frutos de casca rija');

INSERT IGNORE INTO pratos (designacao, alergeno_id) VALUES
  ('Bolo de chocolate', 2),
  ('Pão de forma', 1),
  ('Salada mista', 3);

INSERT IGNORE INTO ementas (data, prato_id) VALUES
  (CURRENT_DATE(), 1),
  (CURRENT_DATE(), 2),
  (CURRENT_DATE(), 3);
