-- -----------------------------------------------------
-- Seed Data
-- -----------------------------------------------------
INSERT INTO users (name, email, role) VALUES
    ('Marcelo Santos', 'marcelosouzasantos77@gmail.com', 'admin');

INSERT INTO allergens (name, icon) VALUES
    ('Glúten', 'Wheat'),
    ('Ovos', 'Egg'),
    ('Lactose', 'Milk'),
    ('Soja', 'Soy'),
    ('Peixe', 'Fish'),
    ('Crustáceos', 'Shrimp'),
    ('Amendoins', 'Peanut'),
    ('Nozes', 'Nut');

INSERT INTO dishes (name, type, description, price, kcals) VALUES
    ('Bacalhau com Natas', 'peixe', 'Tradicional prato português assado com bacalhau, natas e batata.', 6.50, 550),
    ('Feijoada à Transmontana', 'carne', 'Feijoada de carne de porco com enchidos.', 6.00, 650),
    ('Salada Vegetariana', 'vegetariano', 'Salada fresca com legumes variados e grão-de-bico.', 4.50, 300),
    ('Sopa de Legumes', 'sopa', 'Caldo quente de legumes da estação.', 1.50, 120),
    ('Bolo de Chocolate', 'sobremesa', 'Fatia generosa de bolo húmido de chocolate.', 2.00, 400),
    ('Água', 'bebida', 'Garrafa de água mineral 33cl.', 1.00, 0);

-- Dish ↔ Allergen associations
INSERT INTO dish_allergen (dish_id, allergen_id) VALUES
    (1, 1), -- Glúten
    (1, 3), -- Lactose
    (1, 5), -- Peixe
    (2, 1), -- Glúten
    (5, 1), -- Glúten
    (5, 2), -- Ovos
    (5, 3), -- Lactose
    (5, 8); -- Nozes
