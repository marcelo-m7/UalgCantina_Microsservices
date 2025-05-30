-- crud.sql : Stored Procedures and Views for CantinaCast MySQL Database
-- Generated on 2025-05-30

USE ementas;

-- =====================================================
-- VIEWS
-- =====================================================

-- View: dishes with concatenated allergens
CREATE OR REPLACE VIEW vw_dishes_allergens AS
SELECT
  d.id AS dish_id,
  d.name AS dish_name,
  d.type AS dish_type,
  d.description,
  d.price,
  d.kcals,
  GROUP_CONCAT(a.name SEPARATOR ', ') AS allergens
FROM dishes d
LEFT JOIN dish_allergen da ON d.id = da.dish_id
LEFT JOIN allergens a ON da.allergen_id = a.id
GROUP BY d.id;

-- View: full weekly menu with dish names and types
CREATE OR REPLACE VIEW vw_weekly_menu AS
SELECT
  w.week_id,
  w.start_date,
  w.end_date,
  dm.date,
  me.meal_type,
  sd.name AS sopa_name,
  md.name AS main_dish_name,
  ad.name AS alt_dish_name,
  dd.name AS dessert_name,
  me.notes
FROM weeks w
JOIN day_menus dm ON w.id = dm.week_id
JOIN menu_entries me ON dm.id = me.day_menu_id
LEFT JOIN dishes sd ON me.sopa_id = sd.id
JOIN dishes md ON me.main_dish_id = md.id
LEFT JOIN dishes ad ON me.alt_dish_id = ad.id
LEFT JOIN dishes dd ON me.dessert_id = dd.id;

-- =====================================================
-- STORED PROCEDURES: USERS
-- =====================================================

DELIMITER //
CREATE PROCEDURE sp_get_users()
BEGIN
  SELECT id, name, email, role, created_at FROM users;
END;
//

CREATE PROCEDURE sp_create_user(
  IN p_name VARCHAR(100),
  IN p_email VARCHAR(255),
  IN p_role ENUM('admin','editor')
)
BEGIN
  INSERT INTO users (name, email, role) VALUES (p_name, p_email, p_role);
  SELECT LAST_INSERT_ID() AS new_user_id;
END;
//

CREATE PROCEDURE sp_update_user(
  IN p_id INT,
  IN p_name VARCHAR(100),
  IN p_email VARCHAR(255),
  IN p_role ENUM('admin','editor')
)
BEGIN
  UPDATE users
  SET name = p_name,
      email = p_email,
      role = p_role
  WHERE id = p_id;
  SELECT ROW_COUNT() AS affected_rows;
END;
//

CREATE PROCEDURE sp_delete_user(
  IN p_id INT
)
BEGIN
  DELETE FROM users WHERE id = p_id;
  SELECT ROW_COUNT() AS affected_rows;
END;
//
DELIMITER ;

-- =====================================================
-- STORED PROCEDURES: ALLERGENS
-- =====================================================

DELIMITER //
CREATE PROCEDURE sp_get_allergens()
BEGIN
  SELECT id, name, icon, description FROM allergens;
END;
//

CREATE PROCEDURE sp_create_allergen(
  IN p_name VARCHAR(100),
  IN p_icon VARCHAR(50),
  IN p_description VARCHAR(255)
)
BEGIN
  INSERT INTO allergens (name, icon, description) VALUES (p_name, p_icon, p_description);
  SELECT LAST_INSERT_ID() AS new_allergen_id;
END;
//

CREATE PROCEDURE sp_update_allergen(
  IN p_id INT,
  IN p_name VARCHAR(100),
  IN p_icon VARCHAR(50),
  IN p_description VARCHAR(255)
)
BEGIN
  UPDATE allergens
  SET name = p_name,
      icon = p_icon,
      description = p_description
  WHERE id = p_id;
  SELECT ROW_COUNT() AS affected_rows;
END;
//

CREATE PROCEDURE sp_delete_allergen(
  IN p_id INT
)
BEGIN
  DELETE FROM allergens WHERE id = p_id;
  SELECT ROW_COUNT() AS affected_rows;
END;
//
DELIMITER ;

-- =====================================================
-- STORED PROCEDURES: DISHES
-- =====================================================

DELIMITER //
CREATE PROCEDURE sp_get_dishes()
BEGIN
  SELECT * FROM vw_dishes_allergens;
END;
//

CREATE PROCEDURE sp_create_dish(
  IN p_name VARCHAR(140),
  IN p_type ENUM('carne','peixe','vegetariano','vegan','sobremesa','sopa','bebida'),
  IN p_description TEXT,
  IN p_price DECIMAL(6,2),
  IN p_kcals INT
)
BEGIN
  INSERT INTO dishes (name, type, description, price, kcals)
  VALUES (p_name, p_type, p_description, p_price, p_kcals);
  SELECT LAST_INSERT_ID() AS new_dish_id;
END;
//

CREATE PROCEDURE sp_update_dish(
  IN p_id INT,
  IN p_name VARCHAR(140),
  IN p_type ENUM('carne','peixe','vegetariano','vegan','sobremesa','sopa','bebida'),
  IN p_description TEXT,
  IN p_price DECIMAL(6,2),
  IN p_kcals INT
)
BEGIN
  UPDATE dishes
  SET name = p_name,
      type = p_type,
      description = p_description,
      price = p_price,
      kcals = p_kcals
  WHERE id = p_id;
  SELECT ROW_COUNT() AS affected_rows;
END;
//

CREATE PROCEDURE sp_delete_dish(
  IN p_id INT
)
BEGIN
  DELETE FROM dishes WHERE id = p_id;
  SELECT ROW_COUNT() AS affected_rows;
END;
//
DELIMITER ;

-- =====================================================
-- STORED PROCEDURES: MENU_ENTRIES
-- =====================================================

DELIMITER //
CREATE PROCEDURE sp_get_menu_entries_by_week(
  IN p_week_id VARCHAR(8)
)
BEGIN
  SELECT * FROM vw_weekly_menu WHERE week_id = p_week_id ORDER BY date, meal_type;
END;
//

CREATE PROCEDURE sp_upsert_menu_entry(
  IN p_date DATE,
  IN p_meal_type ENUM('lunch','dinner'),
  IN p_sopa_id INT,
  IN p_main_dish_id INT,
  IN p_alt_dish_id INT,
  IN p_dessert_id INT,
  IN p_notes VARCHAR(255)
)
BEGIN
  DECLARE dm_id INT;
  -- find or insert day_menus
  SELECT id INTO dm_id FROM day_menus WHERE date = p_date;
  IF dm_id IS NULL THEN
    INSERT INTO weeks (week_id, start_date, end_date)
      SELECT DATE_FORMAT(p_date, '%X-W%V'), 
             SUBDATE(p_date, WEEKDAY(p_date)), 
             SUBDATE(p_date, WEEKDAY(p_date)) + INTERVAL 4 DAY;
    SET @new_week_id = LAST_INSERT_ID();
    INSERT INTO day_menus (week_id, date) VALUES (@new_week_id, p_date);
    SET dm_id = LAST_INSERT_ID();
  END IF;
  -- upsert menu_entries
  INSERT INTO menu_entries (day_menu_id, meal_type, sopa_id, main_dish_id, alt_dish_id, dessert_id, notes)
  VALUES (dm_id, p_meal_type, p_sopa_id, p_main_dish_id, p_alt_dish_id, p_dessert_id, p_notes)
  ON DUPLICATE KEY UPDATE
    sopa_id = VALUES(sopa_id),
    main_dish_id = VALUES(main_dish_id),
    alt_dish_id = VALUES(alt_dish_id),
    dessert_id = VALUES(dessert_id),
    notes = VALUES(notes);
  SELECT dm_id AS day_menu_id, p_meal_type AS meal_type;
END;
//
DELIMITER ;
