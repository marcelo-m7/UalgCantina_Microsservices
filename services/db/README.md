# 📦 Banco de Dados — UAlg Cantina

Este diretório contém os arquivos SQL necessários para criar e popular o banco de dados da aplicação **Cantina da Universidade do Algarve**. Ele é usado pelos microserviços para armazenar usuários, pratos, alérgenos e ementas semanais.

## 🛠️ Tecnologias

- **MySQL** ou **MariaDB**
- Estrutura compatível com `docker-entrypoint-initdb.d` (caso use Docker)

---

## 📁 Estrutura

- `01_schema.sql`: Criação do banco de dados `cantina_db`
- `02_tables.sql`: Criação das tabelas (`users`, `dishes`, `allergens`, etc.)
- `03_seeds.sql`: Dados de exemplo para testes (pratos, alérgenos e menus)

---

## 🚀 Inicialização com Docker

Se estiver usando Docker com um container de banco de dados (ex: `mysql:8`), os scripts devem estar montados no caminho:

```dockerfile
COPY ./services/db/init /docker-entrypoint-initdb.d
