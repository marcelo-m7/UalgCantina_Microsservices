# Guia de Implementação – API Flask

**CantinaCast – Cantina da Universidade do Algarve**
*Versão 1.0 · 30‑05‑2025*

---

## 1. Visão Geral

A API Flask serve como backend para o CantinaCast, expondo endpoints RESTful que permitem ao frontend Next.js:

* Autenticar administradores via Firebase ID Token
* Gerir recursos CRUD: Users, Allergens, Dishes, Menu Entries
* Consultar e disponibilizar a ementa semanal pública e administrativa
* Executar lógica de negócio com performance e segurança

## 2. Setup Inicial

### 2.1 Pré-requisitos

* Python 3.12+
* Poetry ou pip + virtualenv
* MySQL/MariaDB (contêiner Docker)
* phpMyAdmin (opcional para administração)

### 2.2 Instalação de Dependências

```
# usando Poetry
poetry init --no-interaction
poetry add Flask uvicorn[standard] mysql-connector-python sqlalchemy alembic pydantic firebase-admin python-dotenv
```

### 2.3 Estrutura de Pastas

```
api/
├── app/
│   ├── main.py             # instância Flask + middleware
│   ├── core/               # configurações, settings
│   │   └── config.py       # Pydantic BaseSettings (env)
│   ├── db/                 # inicialização DB, sessão SQLAlchemy
│   │   ├── base.py         # Base declarative
│   │   ├── session.py      # SessionLocal
│   │   └── init.sql        # script de init (init.sql)
│   ├── models/             # SQLAlchemy models
│   │   ├── user.py
│   │   ├── allergen.py
│   │   ├── dish.py
│   │   ├── week.py
│   │   └── menu.py         # day_menus + menu_entries
│   ├── schemas/            # Pydantic schemas
│   │   ├── user.py
│   │   ├── allergen.py
│   │   ├── dish.py
│   │   ├── menu.py
│   │   └── token.py
│   ├── crud/               # funcoes CRUD usando SQLAlchemy
│   │   ├── user.py
│   │   ├── allergen.py
│   │   ├── dish.py
│   │   └── menu.py
│   ├── api/                # routers e dependências
│   │   ├── deps.py         # dependencias comuns (db, auth)
│   │   ├── router.py       # include_routers
│   │   ├── users.py        # endpoints /users
│   │   ├── allergens.py    # /allergens
│   │   ├── dishes.py       # /dishes
│   │   └── menus.py        # /menus
│   └── services/           # lógica extra (ex: gerar week_id)
│       └── menu_service.py
├── alembic/                # migrações Alembic
│   └── env.py
├── .env                     # variáveis de ambiente
└── Dockerfile              # container da API
```

---

## 3. Configuração e Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```
DATABASE_URL=mysql+mysqlconnector://<DB_USER>:<DB_PASS>@db:3306/ementas
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
FIREBASE_AUTH_URI=...
FIREBASE_TOKEN_URI=...
FIREBASE_AUTH_PROVIDER_CERT_URL=...
FIREBASE_CLIENT_CERT_URL=...
```

No `config.py`, utilize `pydantic.BaseSettings` para carregar estas variáveis.

---

## 4. Autenticação com Firebase

1. Inicialize o SDK `firebase-admin` em `app/core/config.py`:

   ```python
   import firebase_admin
   from firebase_admin import credentials, auth

   cred = credentials.Certificate({
       "type": "service_account",
       # ... demais campos do JSON do Firebase
   })
   firebase_admin.initialize_app(cred)
   ```
2. Em `deps.py`, crie a dependência `get_current_user`:

   ```python
   from Flask import Depends, HTTPException, Security
   from Flask.security import HTTPBearer, HTTPAuthorizationCredentials
   from firebase_admin import auth as firebase_auth
   from app.crud.user import get_user_by_email

   security = HTTPBearer()

   def get_current_user(
       token: HTTPAuthorizationCredentials = Security(security),
       db: Session = Depends(get_db)
   ):
       try:
           decoded = firebase_auth.verify_id_token(token.credentials)
           email = decoded['email']
       except Exception:
           raise HTTPException(status_code=401, detail="Invalid auth token")
       user = get_user_by_email(db, email)
       if not user:
           raise HTTPException(status_code=403, detail="User not registered")
       return user
   ```
3. Proteja rotas importando `Depends(get_current_user)` nos routers.

---

## 5. Definição de Schemas e Models

Defina Pydantic schemas em `schemas/` correspondendo aos modelos SQLAlchemy em `models/`. Utilize `orm_mode = True` nos schemas para permitir resposta direta dos objetos ORM.

---

## 6. Routers e Endpoints Principais

### 6.1 Users

* `GET /users/` → lista de todos os users
* `POST /users/` → criar novo user
* `PUT /users/{id}` → atualizar user
* `DELETE /users/{id}` → apagar user

### 6.2 Allergens

* `GET /allergens/`
* `POST /allergens/`
* `PUT /allergens/{id}`
* `DELETE /allergens/{id}`

### 6.3 Dishes

* `GET /dishes/` (retorna view `vw_dishes_allergens`)
* `POST /dishes/`
* `PUT /dishes/{id}`
* `DELETE /dishes/{id}`

### 6.4 Menus

* `GET /public/weekly/` → ementa pública (sem necessidade de admin)
* `GET /menus/weekly-admin/` → ementa para admin
* `PUT /menus/day/{date}/{meal_type}` → upsert de menu entry

Use `router.include_router()` em `router.py` para agrupar.

---

## 7. Integração com o Banco de Dados

Utilize SQLAlchemy e a sessão `SessionLocal` em `db/session.py`:

```python
# base.py
target_metadata = Base.metadata

# session.py
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

Inclua `@app.on_event('startup')` para criar tabelas via Alembic ou `Base.metadata.create_all()` se preferir.

---

## 8. Migrações e Testes

* **Alembic**: configure `alembic.ini` e use `alembic revision --autogenerate` para criar migrações.
* **Testes**: use **pytest** + **httpx.AsyncClient** para testes de integração nos endpoints.

---

## 9. Deploy com Docker Compose

No `docker-compose.yml`:

```yaml
services:
  api:
    build: ./api
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      - db
  db:
    image: mariadb:10.11
    volumes:
      - db_data:/var/lib/mysql
      - ./api/app/db/init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      MARIADB_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MARIADB_DATABASE: ementas
      MARIADB_USER: ${DB_USER}
      MARIADB_PASSWORD: ${DB_PASSWORD}
  phpmyadmin:
    image: phpmyadmin
    ports: ["8081:80"]
    environment:
      PMA_HOST: db
volumes:
  db_data:
```

---

## 10. Roadmap e Boas Práticas

* Monitorização de performance (Prometheus/Grafana)
* Logs estruturados (JSON + ELK)
* Versionamento de API (prefira `/v1/`)
* Documentação automática via **OpenAPI** e **Swagger UI** (já gerada pelo Flask)

---

*Fim do documento*
