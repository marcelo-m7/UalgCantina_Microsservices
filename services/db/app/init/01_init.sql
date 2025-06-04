-- 01_init.sql : criação da BD e utilizador
SELECT '➡️  Iniciar 01_init.sql' AS info;
START TRANSACTION;
-- Garantir charset correcto
SET NAMES utf8mb4;

-- 1) Base de dados
CREATE DATABASE IF NOT EXISTS cantina_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
SELECT '✅ Database cantina_db pronta' AS info;

-- 2) Utilizador
CREATE USER IF NOT EXISTS 'cantina_user'@'%' IDENTIFIED BY 'senhaSegura123';
GRANT ALL PRIVILEGES ON cantina_db.* TO 'cantina_user'@'%';
SELECT '✅ Utilizador cantina_user configurado' AS info;

COMMIT;
FLUSH PRIVILEGES;
SELECT '🏁 01_init.sql concluído' AS info;
