-- Inserir alergenos
INSERT INTO Alergenos (nome) VALUES
('Glúten'),
('Lactose'),
('Frutos secos');

-- Inserir pratos
INSERT INTO Pratos (designacao) VALUES
('Arroz de Frango'),
('Sopa de Legumes'),
('Salmão Grelhado'),
('Salada Verde');

-- Inserir ementas
INSERT INTO Ementas (data) VALUES
('2025-05-03'),
('2025-05-04');

-- Relacionar pratos com ementas
INSERT INTO EmentaPrato (ementa_id, prato_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4);

-- Relacionar pratos com alergenos
INSERT INTO PratoAlergeno (prato_id, alergeno_id) VALUES
(1, 1),  -- Arroz de Frango tem Glúten
(2, 2),  -- Sopa de Legumes tem Lactose
(3, 1),  -- Salmão Grelhado tem Glúten
(4, 3);  -- Salada Verde tem Frutos secos