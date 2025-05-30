# README – Banco de Dados CantinaCast

Este documento descreve a estrutura, inicialização e uso do banco de dados MySQL do projeto **CantinaCast**.

## 1. Visão Geral

O banco de dados **`ementas`** armazena informações sobre utilizadores, alérgenos, pratos e ementas semanais. Ele é acessado pelo backend **FastAPI**, que expõe operações CRUD e consultas otimizadas via **stored procedures** (SPs) e **views**.

### Principais Componentes

* **Schemas/Tabelas:**

  * `users` – administradores/autorizados (nome, email, role).
  * `allergens` – lista de alérgenos (nome, ícone, descrição).
  * `dishes` – registo de pratos (nome, tipo, preço, calorias, etc.).
  * `dish_allergen` – relação N\:N entre pratos e alérgenos.
  * `weeks` – identificação de seman...
