-- services/db/init/00_init.sql

-- 1) Cria o banco de dados (caso não exista) e seleciona ele
CREATE DATABASE IF NOT EXISTS cantina_db;
USE cantina_db;

-- 2) Cria usuário e concede privilégios
CREATE USER IF NOT EXISTS 'cantina_user'@'%' IDENTIFIED BY 'senhaSegura123';
GRANT ALL PRIVILEGES ON cantina_db.* TO 'cantina_user'@'%';

-- 3) Aplica imediatamente as mudanças de privilégios
FLUSH PRIVILEGES;
