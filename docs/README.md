# Guia de Implementação – Banco de Dados MySQL

**CantinaCast – Cantina da Universidade do Algarve**
Versão 1.0 · 30‑05‑2025

---

## 1. Objetivo

Este guia detalha a criação, inicialização e manutenção do esquema MySQL utilizado pelo back‑end FastAPI do CantinaCast. Inclui o script `init.sql` (link abaixo) para provisionamento automático do contêiner `db` no `docker-compose`.

[Download do script SQL de inicialização](sandbox:/mnt/data/init.sql)

---

## 2. Resumo do Esquema

| Tabela          | Descrição                               | Chaves / Índices Relevantes   |
| --------------- | --------------------------------------- | ----------------------------- |
| `users`         | Controlo de acesso (admins/editores)    | `email` UNIQUE, `role` ENUM   |
| `allergens`     | Catálogo de alérgenos                   | —                             |
| `dishes`        | Pratos disponíveis                      | `type` ENUM, preço, kcal      |
| `dish_allergen` | Ligação *many‑to‑many* prato ↔ alérgeno | PK `(dish_id, allergen_id)`   |
| `weeks`         | Identificador ISO da semana             | `week_id` UNIQUE              |
| `day_menus`     | Dias dentro de uma semana               | `date` UNIQUE, FK→`weeks`     |
| `menu_entries`  | Almoço/Jantar por dia                   | UK `(day_menu_id, meal_type)` |

> **Nota:** todas as tabelas usam `InnoDB` e `utf8mb4`.

---

## 3. Diagrama ER Simplificado

Sugere‑se gerar um diagrama ER usando MySQL Workbench ou [dbdiagram.io](https://dbdiagram.io) importando o `init.sql`.

---

## 4. Script `init.sql`

O ficheiro cria o schema, aplica restrições de chave‑estrangeira e insere dados de semente:

* **1 utilizador** administrador (Marcelo Santos)
* **8 alérgenos** mais comuns
* **6 pratos** de exemplo
* **Associações** prato ↔ alérgeno

[Download do script SQL de inicialização](sandbox:/mnt/data/init.sql)

---

## 5. Integração com Docker

No `docker-compose.yml`, monte o script:

```yaml
  db:
    image: mariadb:10.11
    volumes:
      - db_data:/var/lib/mysql
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
```

Na primeira execução, o entrypoint do MariaDB executará `init.sql`.

---

## 6. Boas‑Práticas

1. **Migrations**: use *Alembic* no FastAPI para evoluções. Trave a branch ao modificar `init.sql`.
2. **Backups**: `mysqldump --routines --single-transaction ementas > backup.sql` (agendar via cron no host ou contêiner).
3. **Dados sensíveis**: nunca commit das passwords de BD; utilize variáveis de ambiente no `docker-compose`.
4. **Indexes**: adicionar conforme crescimento (ex.: `price`, `type` em `dishes`).

---

## 7. Próximos Passos

* Popular a tabela `weeks` e `day_menus` via backend ou script.
* Considerar colunas de audit (`updated_at`, `updated_by`).
* Analisar *partitioning* por ano se o histórico crescer.

---

**Contato:** dev‑[cantina@ualg.pt](mailto:cantina@ualg.pt)
