# API

## Tecnologias Utilizadas

* **FastAPI:** Framework de alto desempenho para construção de APIs.
* **SQLAlchemy:** ORM para interagir com o banco MySQL.
* **MySQL (pymysql):** Banco de dados relacional para armazenar menus, pratos e alergénios.
* **Google Auth / Firebase:** Biblioteca para verificar ID Tokens do Firebase nas rotas protegidas.
* **Uvicorn:** ASGI server para executar a aplicação FastAPI.
* **python-dotenv:** Para carregar variáveis de ambiente a partir de um arquivo `.env`.

## Estrutura de Pastas

```
backend/
├─ app.py
├─ config.py
├─ database.py
├─ models.py
├─ schemas.py
├─ crud.py
├─ deps.py
├─ requirements.txt
└─ .env.example
```

* **app.py**: Ponto de entrada da API, registra rotas e configura CORS.
* **config.py**: Carrega variáveis de ambiente (.env) e fornece a URL de conexão com o MySQL.
* **database.py**: Configura engine e sessão do SQLAlchemy e executa `create_all()` para criar tabelas.
* **models.py**: Define as tabelas SQLAlchemy (Allergen, Dish, MenuEntry) e seus relacionamentos.
* **schemas.py**: Modelos Pydantic para validação de dados de entrada/saída (Allergen, Dish, MenuEntry).
* **crud.py**: Funções de CRUD (create, read, update, delete) para cada modelo.
* **deps.py**: Dependências do FastAPI, incluindo sessão do banco e verificação de token Firebase.
* **requirements.txt**: Lista de dependências Python usadas pelo projeto.
* **.env.example**: Exemplo de variáveis de ambiente necessárias.

## Pré-requisitos

* Python 3.10+
* MySQL acessível (local ou remoto)
* Conta e projeto Firebase configurado (apenas para geração de ID tokens no frontend)
* Git (para clonar o repositório)

## Rodar em Developing

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
## Configuração e Instalação

1. **Instale as dependências:**

   ```bash
   pip install -r requirements.txt
   ```
2. **Configure as variáveis de ambiente:**

   * Copie o exemplo de arquivo `.env.example` para `.env`:

     ```bash
     cp .env.example .env
     ```


   ```env
   # Configuração do MySQL
    MYSQL_USER=cantina_user
    MYSQL_PASSWORD=
    MYSQL_HOST=
    MYSQL_PORT=3306
    MYSQL_DB=cantina_db

   # Configuração do Firebase
    FIREBASE_PROJECT_ID=ualg-cantina

   # CORS (origens permitidas pela API, separadas por vírgula)
    # ALLOWED_ORIGINS=
  ```

3. **Construção dos Web Apps:**

  ```bash
   # Proxy (Para testes locais)

   .\cloud-sql-proxy.exe ualg-cantina-a79433:northamerica-northeast2:cantinacas-tdb
   
   # Artifact Registry comandos: 

    docker build -t us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcantina/ualgcantina-api .

    docker push us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcast/ualgcantina-api:latest

   ```

   ```bash
   PS C:\Users\marce\OneDrive - Universidade do Algarve\Ualg\Cadeiras UALG 2024-2025\Computação em Núvem\TP3_Azure_Marcelo Santos_a79433\UalgCantina_Microsservices\services\api> docker push us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcantina/ualgcantina-api:latest
    The push refers to repository [us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcantina/ualgcantina-api]      
    ce1945dade9f: Layer already cd329745d8b6: Pushed        220040079aa8: Pushed        ee26a9841381: Pushed        MB/28.86MBa2: Pushed        9B/109B1ae5e: Layer already exists 465a5: Layer already 
    2085f9e6ccae: Layer already c6212f1692bd: Pushed        latest: digest: sha256:354924ecce09b03ee874b7a5dccdf1416ef36bd183e190f80a3beae56c58e6b7 size: 856
    PS C:\Users\marce\OneDrive - Universidade do Algarve\Ualg\Cadeiras UALG 2024-2025\Computação em Núvem\TP3_Azure_Marcelo Santos_a79433\UalgCantina_Microsservices\service
   ```

## Como Executar a API

- API (Contentor)
    URL: https://ualgcantina-api-847590019108.europe-west1.run.app/docs/

    Variáveis:
    ```
    MYSQL_USER=cantina_user
    MYSQL_PASSWORD=
    MYSQL_HOST=ualg-cantina-a79433:northamerica-northeast2:cantinacas-tdb
    MYSQL_PORT=3306
    MYSQL_DB=cantina_db
    FIREBASE_PROJECT_ID=ualg-cantina
    ```

- Banco de Dados MySQL (Cloud SQL Instance):
    ```
    Nome da conexão
    ualg-cantina-a79433:northamerica-northeast2:cantinacas-tdb 
    
    Conectividade de IP particular
    Ativado
        Rede associada
        projects/ualg-cantina-a79433/global/networks/default 
        Rede
        default
        Método de conexão de serviço
        Acesso privado a serviços
        Intervalo de IP alocado
        Intervalo de IPs atribuído automaticamente
        Endereço IP interno
        10.81.16.3
    Conectividade de IP público
    Ativado
        Endereço IP público
        34.130.199.30 
    ```

## Endpoints da API

Todos os endpoints estão sob o prefixo ``.

### Rotas Públicas

* **`GET /allergens/`**
  Retorna a lista de todos os alergénios.
  **Autenticação:** Nenhuma.

* **`GET /dishes/`**
  Retorna a lista de todos os pratos (incluindo campos básicos e IDs de alergénios).
  **Autenticação:** Nenhuma.

* **`GET /dishes/{dish_id}`**
  Retorna os detalhes de um prato específico, incluindo lista de alergénios.
  **Autenticação:** Nenhuma.

* **`GET /public/weekly/`**
  Retorna todos os registros de `MenuEntry`. O frontend pode filtrar por data (`date`) e tipo de refeição (`meal_type`).
  **Autenticação:** Nenhuma.

### Rotas Protegidas (requerem ID Token do Firebase)

As rotas de escrita exigem um header no formato:

```
Authorization: Bearer <ID_TOKEN_DO_FIREBASE>
```

O token será verificado contra o projeto Firebase definido em `FIREBASE_PROJECT_ID`. Se inválido ou ausente, a API retorna 401.

* **`POST /allergens/`**
  Cria um novo alergénio.
  **Corpo (JSON):**

  ```json
  {
    "id": "allergen-uuid-ou-ulid",
    "name": "Glúten",
    "icon": "wheat",
    "description": "Contém trigo"
  }
  ```

  **Autenticação:** Sim.

* **`PUT /allergens/{allergen_id}`**
  Atualiza um alergénio existente (qualquer campo enviado no corpo será modificado).
  **Corpo (JSON):**

  ```json
  {
    "name": "Novo Nome",
    "icon": "novo_icon",
    "description": "Nova descrição"
  }
  ```

  **Autenticação:** Sim.

* **`DELETE /allergens/{allergen_id}`**
  Remove um alergénio.
  **Autenticação:** Sim (Retorna 204 se removido com sucesso ou nada se não encontrado).

* **`POST /dishes/`**
  Cria um novo prato.
  **Corpo (JSON):**

  ```json
  {
    "id": "dish-uuid-ou-ulid",
    "name": "Frango Grelhado",
    "type": "carne",
    "description": "Frango com ervas",
    "price": 12.5,
    "kcals": 450,
    "allergen_ids": ["allergen-id-1", "allergen-id-2"]
  }
  ```

  **Autenticação:** Sim.

* **`PUT /dishes/{dish_id}`**
  Atualiza um prato existente (qualquer campo enviado no corpo será modificado).
  **Corpo (JSON):**

  ```json
  {
    "name": "Novo Nome",
    "price": 15.0,
    "allergen_ids": ["outro-allergen-id"]
  }
  ```

  **Autenticação:** Sim.

* **`DELETE /dishes/{dish_id}`**
  Remove um prato.
  **Autenticação:** Sim (Retorna 204 se removido com sucesso ou nada se não encontrado).

* **`GET /menus/{date_str}/{meal_type}`**
  Consulta uma entrada de menu específica para uma data e tipo de refeição.

  * `date_str`: formato `YYYY-MM-DD`
  * `meal_type`: `"almoco"` ou `"jantar"`
    **Exemplo:** `/menus/2025-06-01/almoco`
    **Autenticação:** Sim.

* **`POST /menus/`**
  Cria uma nova entrada de menu para data e tipo de refeição.
  **Corpo (JSON):**

  ```json
  {
    "id": "menuentry-uuid-ou-ulid",
    "date": "2025-06-01",
    "meal_type": "almoco",
    "main_dish_id": "uuid-prato-principal",
    "alt_dish_id": "uuid-prato-alternativo",       // opcional
    "dessert_id": "uuid-sobremesa",
    "sopa_id": "uuid-sopa",                        // opcional
    "notes": "Sem glúten hoje"
  }
  ```

  **Autenticação:** Sim.

* **`PUT /menus/{date_str}/{meal_type}`**
  Atualiza uma entrada de menu já existente.
  **Corpo (JSON):**

  ```json
  {
    "main_dish_id": "novo-uuid-prato",
    "alt_dish_id": null,
    "dessert_id": "novo-uuid-sobremesa",
    "sopa_id": "novo-uuid-sopa",
    "notes": "Atualização de nota"
  }
  ```

  **Autenticação:** Sim.

* **`DELETE /menus/{date_str}/{meal_type}`**
  Remove uma entrada de menu específica (se existir).
  **Autenticação:** Sim (Retorna 204 se removido com sucesso ou nada se não existir).

## Esquema do Banco de Dados

A estrutura de tabelas no MySQL é:

* **`allergens`**

  * `id` (VARCHAR(36), PK)
  * `name` (VARCHAR(100), UNIQUE, NOT NULL)
  * `icon` (VARCHAR(200), NULL)
  * `description` (TEXT, NULL)

* **`dishes`**

  * `id` (VARCHAR(36), PK)
  * `name` (VARCHAR(100), UNIQUE, NOT NULL)
  * `type` (ENUM: `carne`, `peixe`, `vegetariano`, `vegan`, `sobremesa`, `sopa`, `bebida`)
  * `description` (TEXT, NULL)
  * `price` (FLOAT, NOT NULL)
  * `kcals` (INT, NULL)

* **`dish_allergen`** (tabela de associação many-to-many)

  * `dish_id` (VARCHAR(36), FK → `dishes.id`)
  * `allergen_id` (VARCHAR(36), FK → `allergens.id`)

* **`menu_entries`**

  * `id` (VARCHAR(36), PK)
  * `date` (DATE, NOT NULL)
  * `meal_type` (VARCHAR(10), NOT NULL) – valores esperados: `"almoco"` ou `"jantar"`
  * `main_dish_id` (VARCHAR(36), FK → `dishes.id`, NOT NULL)
  * `alt_dish_id` (VARCHAR(36), FK → `dishes.id`, NULL)
  * `dessert_id` (VARCHAR(36), FK → `dishes.id`, NOT NULL)
  * `sopa_id` (VARCHAR(36), FK → `dishes.id`, NULL)
  * `notes` (TEXT, NULL)

As tabelas são criadas automaticamente via `Base.metadata.create_all()` na inicialização da API.

## Autenticação e Autorização

1. **Como funciona a verificação de token do Firebase**

   * O frontend Next.js deve obter um ID Token válido do Firebase (usando Firebase Auth) após o login do usuário.
   * Em todas as requisições a rotas protegidas, deverá enviar o header:

     ```
     Authorization: Bearer <ID_TOKEN_DO_FIREBASE>
     ```
   * Na rota, o `Depends(verify_firebase_token)` no `deps.py` faz:

     * Validação da assinatura e expiração do token.
     * Verifica se o `issuer` (iss) corresponde ao seu projeto (via `FIREBASE_PROJECT_ID`).
     * Retorna as *claims* decodificadas se o token for válido.

2. **Controle de Acesso / Perfis**

   * Atualmente, não há distinção de perfis (admin/editor) codificada no backend — qualquer token válido do Firebase consegue acessar as rotas protegidas.
   * Caso queira controlar por perfil, adicione checagem de `claims.get("role")` dentro de `get_current_user()` em `deps.py`, por exemplo:

     ```python
     def get_current_user(claims: dict = Depends(verify_firebase_token)):
         role = claims.get("role")
         if role not in ("admin", "editor"):
             raise HTTPException(status_code=403, detail="Permissão insuficiente")
         return claims
     ```
   * Nesse caso, você deve atribuir custom claims de `role` (admin/editor) aos usuários diretamente no Firebase.
