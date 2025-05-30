-- Alergénios
INSERT INTO Alergenos (nome) VALUES ('Glúten'), ('Lactose'), ('Frutos Secos');

-- Pratos
INSERT INTO Pratos (designacao) VALUES 
('Lasanha de legumes'), 
('Bife de frango grelhado'), 
('Salada de atum');

-- Relação prato-alergeno
INSERT INTO PratoAlergeno (prato_id, alergeno_id) VALUES 
(1, 1),  -- Lasanha contém glúten
(1, 2),  -- Lasanha contém lactose
(3, 3);  -- Salada com frutos secos

-- Ementas (por data)
INSERT INTO Ementas (data) VALUES 
('2025-05-05'), 
('2025-05-06');

-- Associação ementa-prato
INSERT INTO EmentaPrato (ementa_id, prato_id) VALUES 
(1, 1), 
(1, 2), 
(2, 2), 
(2, 3);