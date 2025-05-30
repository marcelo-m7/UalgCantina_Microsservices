# Guia de Desenvolvimento – **Back‑end & Modelos de Dados**

**Sistema CantinaCast – Cantina da Universidade do Algarve**
*Versão 1.0 · 30‑05‑2025*

---

## 1. Visão Geral

Este documento descreve a proposta **atualizada** para o back‑end, modelos de dados SQL e respectivas APIs, alinhada com o frontend Next.js/React (CantinaCast) já implementado.

Em síntese, o back‑end expõe serviços REST seguros que autenticam administradores via Firebase, persistem dados em MySQL e fornecem a ementa semanal tanto para o público como para o painel de gestão. Ele atua como camada de orquestração entre o frontend e a base de dados, assegurando integridade, regras de negócio e desempenho escalável.

### 🔑 Pontos‑chave

* **API:** FastAPI (…Python 3.12)
* **Auth:** Firebase ID Token → Verificação `firebase‑admin` → consulta à tabela **users**
* **DB:** MySQL 8.0 (ou MariaDB 10.11 compat.) + phpMyAdmin
* **Containers:** Docker Compose (frontend, api, db, phpmyadmin)
* **ORM:** SQLAlchemy 2.0 + Alembic
* **Tipo de IDs:** `CHAR(36)` (UUID v4) – coincide com strings no frontend
* **Timezone:** UTC em todas as datas; frontend converte para local

---

## 2. Arquitetura de Contêineres

| Serviço        | Imagem base                      | Porta     | Função                    |
| -------------- | -------------------------------- | --------- | ------------------------- |
| **frontend**   | `node:20-alpine` + Nginx         | 3000 → 80 | Next.js /menu & /admin    |
| **api**        | `python:3.12-slim`               | 8000      | FastAPI + Uvicorn         |
| **db**         | `mysql:8.4` ♾ ou `mariadb:10.11` | 3306      | Armazena todas as tabelas |
| **phpmyadmin** | `phpmyadmin:latest`              | 8081      | UI web para DB            |

> **Observação:** As variáveis de ambiente e volumes estão detalhadas no Apêndice A (`docker-compose.yml`).

---

## 3. Modelo de Dados Relacional (ER)

```text
users              dishes                 allergens          weekly_menus
───────            ────────              ─────────          ─────────────
id (PK)            id (PK)               id (PK)            id (PK)
email UNIQUE       name                  name               week_start DATE
role ENUM          type                  icon               week_end   DATE
created_at         description           description        created_at DATETIME
                   price DECIMAL(5,2)                        
                   kcals INT NULL

            dish_allergens (junction)                     day_menus
            ───────────────────────                     ───────────
            dish_id  (PK)(FK→dishes.id)                 id  (PK)
            allergen_id(PK)(FK→allergens.id)            date        DATE UNIQUE
                                                        lunch_id    FK→menu_entries.id
menu_entries                                           dinner_id    FK→menu_entries.id
────────────                                             
id (PK)                                                 
date       DATE                                         
meal_type  ENUM('lunch','dinner')                       
main_dish_id   FK→dishes.id                             
alt_dish_id    FK→dishes.id NULL                        
soup_id        FK→dishes.id NULL                        
dessert_id     FK→dishes.id                             
notes          TEXT NULL                                 
created_at     DATETIME                                  
```

### Regras Principais

1. **`users.email`** deve existir para que o Firebase ID Token seja aceite.
2. **Tipos de prato (`dishes.type`)** devem cobrir os enum usados no frontend: `'carne','peixe','vegetariano','vegan','sobremesa','sopa','bebida'`.
3. **`weekly_menus`** referencia uma semana ISO; é populada via `day_menus`.

### Script DDL (MySQL 8)

```sql
CREATE TABLE users (
  id          CHAR(36) PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  role        ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE allergens (
  id          CHAR(36) PRIMARY KEY,
  name        VARCHAR(80) NOT NULL,
  icon        VARCHAR(60),
  description TEXT
);

CREATE TABLE dishes (
  id          CHAR(36) PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  type        ENUM('carne','peixe','vegetariano','vegan','sobremesa','sopa','bebida') NOT NULL,
  description TEXT,
  price       DECIMAL(5,2) NOT NULL,
  kcals       INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dish_allergens (
  dish_id     CHAR(36) NOT NULL,
  allergen_id CHAR(36) NOT NULL,
  PRIMARY KEY (dish_id, allergen_id),
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
  FOREIGN KEY (allergen_id) REFERENCES allergens(id) ON DELETE CASCADE
);

CREATE TABLE menu_entries (
  id            CHAR(36) PRIMARY KEY,
  date          DATE NOT NULL,
  meal_type     ENUM('lunch','dinner') NOT NULL,
  main_dish_id  CHAR(36) NOT NULL,
  alt_dish_id   CHAR(36),
  soup_id       CHAR(36),
  dessert_id    CHAR(36) NOT NULL,
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (main_dish_id) REFERENCES dishes(id),
  FOREIGN KEY (alt_dish_id)  REFERENCES dishes(id),
  FOREIGN KEY (soup_id)      REFERENCES dishes(id),
  FOREIGN KEY (dessert_id)   REFERENCES dishes(id),
  UNIQUE(date, meal_type)
);

CREATE TABLE day_menus (
  id         CHAR(36) PRIMARY KEY,
  date       DATE NOT NULL UNIQUE,
  lunch_id   CHAR(36),
  dinner_id  CHAR(36),
  FOREIGN KEY (lunch_id)  REFERENCES menu_entries(id) ON DELETE SET NULL,
  FOREIGN KEY (dinner_id) REFERENCES menu_entries(id) ON DELETE SET NULL
);

CREATE TABLE weekly_menus (
  id          CHAR(36) PRIMARY KEY,
  week_start  DATE NOT NULL,
  week_end    DATE NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(week_start, week_end)
);
```

---

## 4. Estrutura do Projeto FastAPI

```
api/
├── app/
│   ├── main.py            # Ponto de entrada (FastAPI instance)
│   ├── core/
│   │   ├── config.py      # Variáveis de ambiente (Pydantic Settings)
│   │   └── security.py    # Decodificação do Firebase ID Token
│   ├── db/
│   │   ├── session.py     # SQLAlchemy engine & session
│   │   ├── base.py        # Base declarativa
│   │   └── models/        # ORM models (users, dishes, ...)
│   ├── schemas/
│   │   └── ...            # Pydantic models equivalentes aos Types do frontend
│   ├── crud/
│   │   └── ...            # Funções de acesso/repositórios
│   ├── api/
│   │   ├── deps.py        # Depends comuns (db, auth)
│   │   ├── v1/
│   │   │   ├── routers/
│   │   │   │   ├── allergens.py
│   │   │   │   ├── dishes.py
│   │   │   │   ├── menus.py
│   │   │   │   └── public.py
│   │   │   └── __init__.py
│   │   └── __init__.py
│   └── alembic/           # Migrações automáticas
├── Dockerfile
└── pyproject.toml         # PDM/Poetry + dependências
```

### Principais Bibliotecas

| Propósito           | Lib (versão)         |
| ------------------- | -------------------- |
| Web framework       | FastAPI 0.111        |
| ASGI Server         | Uvicorn 0.30         |
| ORM                 | SQLAlchemy 2.0       |
| Migrações           | Alembic 1.13         |
| Firebase Admin      | firebase‑admin 6.x   |
| Auth Headers        | fastapi‑security 0.2 |
| Valid. & Serializar | Pydantic v2          |
| Testing             | Pytest, HTTPX Async  |

---

## 5. Autenticação & Autorização

1. **Frontend** envia **`Authorization: Bearer <ID_TOKEN>`** em todas as requisições.
2. **Dependency** `get_current_user()` implementa:

   ```python
   from fastapi import Depends, HTTPException, status
   from firebase_admin import auth as fb_auth
   from .db.session import SessionLocal
   from .db.models.user import User

   async def get_current_user(token: Annotated[str, Header(alias="Authorization")]):
       if not token.startswith("Bearer "):
           raise HTTPException(status_code=401, detail="Invalid token header")
       id_token = token.removeprefix("Bearer ").strip()
       try:
           decoded = fb_auth.verify_id_token(id_token)
       except fb_auth.InvalidIdTokenError:
           raise HTTPException(status_code=401, detail="Token invalid")
       email = decoded.get("email")
       db = SessionLocal()
       user = db.query(User).filter_by(email=email).first()
       if not user:
           raise HTTPException(status_code=403, detail="Not authorised")
       return user
   ```
3. Routers podem exigir `Depends(get_current_user)` ou `Depends(AdminOnly)`.

---

## 6. Especificação dos Endpoints (v1)

### Exemplos de Request/Response

#### `GET /public/weekly/`

```http
GET /public/weekly/
Authorization: Bearer <ID_TOKEN>
```

**Response 200**

```json
{
  "weekId": "2025-W22",
  "startDate": "2025-05-26",
  "endDate": "2025-05-30",
  "days": [
    {
      "date": "2025-05-26",
      "lunch": {
        "id": "3ad3e9f3-...",
        "mealType": "lunch",
        "mainDishId": "a1b2c3d4-...",
        "mainDish": {
          "id": "a1b2c3d4-...",
          "name": "Bacalhau à Brás",
          "type": "peixe",
          "price": "8.50"
        },
        "dessertId": "d9e8f7g6-...",
        "dessert": {
          "id": "d9e8f7g6-...",
          "name": "Arroz Doce",
          "type": "sobremesa",
          "price": "2.50"
        }
      }
    }
  ]
}
```

#### `POST /dishes/`

```http
POST /dishes/
Content-Type: application/json
Authorization: Bearer <ID_TOKEN>
```

**Request Body**

```json
{
  "name": "Salada de Quinoa",
  "type": "vegan",
  "description": "Quinoa com legumes grelhados, abacate e tahini",
  "price": 6.50,
  "kcals": 420,
  "allergenIds": ["<gluten-id>", "<soja-id>"]
}
```

**Response 201**

```json
{
  "id": "e7f6c5b4-...",
  "name": "Salada de Quinoa",
  "type": "vegan",
  "description": "Quinoa com legumes grelhados, abacate e tahini",
  "price": "6.50",
  "kcals": 420,
  "allergenIds": ["<gluten-id>", "<soja-id>"],
  "createdAt": "2025-05-30T12:34:56Z"
}
```

| Método     | Rota                           | Auth | Descrição                 | Body/Params       | Resposta     |
| ---------- | ------------------------------ | ---- | ------------------------- | ----------------- | ------------ |
| **GET**    | `/public/weekly/`              | ❌    | Ementa da semana corrente | —                 | `WeeklyMenu` |
| **GET**    | `/allergens/`                  | ✅    | Lista todos os alérgenos  | —                 | `Allergen[]` |
| **POST**   | `/allergens/`                  | ✅    | Cria alérgeno             | `AllergenCreate`  | `Allergen`   |
| **PUT**    | `/allergens/{id}`              | ✅    | Atualiza                  | `AllergenUpdate`  | `Allergen`   |
| **DELETE** | `/allergens/{id}`              | ✅    | Remove                    | —                 | 204          |
| **GET**    | `/dishes/`                     | ✅    | Lista pratos              | `type?`           | `Dish[]`     |
| **POST**   | `/dishes/`                     | ✅    | Cria prato                | `DishCreate`      | `Dish`       |
| **PUT**    | `/dishes/{id}`                 | ✅    | Atualiza                  | `DishUpdate`      | `Dish`       |
| **DELETE** | `/dishes/{id}`                 | ✅    | Remove                    | —                 | 204          |
| **GET**    | `/menus/weekly-admin/`         | ✅    | Weekly menu admin view    | —                 | `WeeklyMenu` |
| **PUT**    | `/menus/day/{date}/{mealType}` | ✅    | Atualiza entrada          | `MenuEntryUpdate` | `DayMenu`    |

> **Nota:** Todas as respostas usam **camelCase** no JSON, para corresponder aos tipos do frontend. O util `from pydantic import BaseModel` + `model_config = ConfigDict(populate_by_name=True)` garante isso.

---

## 7. Scripts Docker & Dev

### `docker-compose.yml` (essência)

```yaml
services:
  api:
    build: ./api
    ports: ["8000:8000"]
    env_file: ./api/.env
    depends_on: [db]

  db:
    image: mysql:8.4
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ementas
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin
    ports: ["8081:80"]
    environment:
      PMA_HOST: db
      PMA_USER: ${DB_USER}
      PMA_PASSWORD: ${DB_PASSWORD}
    depends_on: [db]
volumes:
  db_data:
```

---

## 8. Integração com o Frontend

* **URLs** – O frontend lê `NEXT_PUBLIC_API_URL` (ex: `http://localhost:8000/api/v1`).
* **CORS** – `fastapi.middleware.cors.CORSMiddleware` deverá permitir a origem do frontend (`http://localhost:3000` em dev).
* **Serialização** – Todas as datas são ISO‑8601 (`YYYY-MM-DD`). Preços são `string` no JSON para evitar arredondamento (`"8.50"`).
* **Paginação** – Endpoints de listagem aceitam `limit` & `offset` (default 100) mas o frontend ainda não paginou; pode‑se retornar todos por ora.

---

## 9. Roadmap de Sprints (2 semanas)

| Sprint  | Objetivo           | Entregáveis                                            |
| ------- | ------------------ | ------------------------------------------------------ |
| **0.5** | Boot API           | Dockerfile, `main.py` Hello, CORS, healthcheck         |
| **1**   | Models + Migrações | DDL via Alembic, CRUD de allergens                     |
| **2**   | Dishes CRUD + Auth | Verificação Firebase, endpoints completos de pratos    |
| **3**   | Menus & Weekly     | Lógica weekly aggregation, endpoints `/public/weekly/` |
| **4**   | Integração Front   | Ajustes de CORS, testes e2e frontend+api               |

---

## 10. Testes & Qualidade

* **Pytest** com fixture `async_client` (HTTPX).
* **Pre‑commit**: Ruff + MyPy.
* **CI (GitHub Actions)**: lint ➜ tests ➜ build Docker.
* **Coverage target** > 85 %.

---

## 11. Segurança

* **JWT expiração** – verificar `exp` do ID Token.
* **Rate Limit** – possível uso de `slowapi` para 100 req/min por IP.
* **SQL injection** – somente SQLAlchemy param‑bound.
* **Secrets** – `.env` não versionado; use GitHub Secrets no CI.

---

## 12. Observações Finais

Este backend foi desenhado para casar 1‑a‑1 com os tipos e fluxos descritos no CantinaCast. Alterações de contrato devem ser negociadas em pull request entre equipa front e back.

---

### Apêndice A – `docker-compose.yml` completo

*(Ver pasta infra do repositório para a versão mais actualizada)*
