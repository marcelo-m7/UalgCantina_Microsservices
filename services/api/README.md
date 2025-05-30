# API Flask Simplificada – CantinaCast (Versão Light)

## Objetivo

Este projeto contém uma implementação mínima, porém funcional, da API CantinaCast em **Flask**, focada nos endpoints essenciais e no fluxo de autenticação via Firebase. A estrutura é simplificada para facilitar a leitura e manutenção, com todos os componentes principais localizados na pasta `api/`.

## Stack Resumida

| Camada        | Tecnologia                                   |
| ------------- | -------------------------------------------- |
| Web Framework | Flask 3                                      |
| ORM           | SQLAlchemy 2 (Declarative)                   |
| Auth          | firebase‑admin (verificação de ID Token)     |
| DB            | MySQL/MariaDB (mesma schema `init.sql`)      |
| Runner        | Gunicorn + gevent (prod) / `flask run` (dev) |

## Estrutura de Pastas
```
api/
├── app.py            # Flask app + routes
├── config.py         # carregar .env
├── db.py             # engine + Base + Session
├── models.py         # Definição dos modelos de dados
├── auth.py           # Decorador @require_admin para autenticação
├── requirements.txt  # Dependências PIP
├── Dockerfile        # Container da API
└── docker-compose.yml# Stack (api, db, phpmyadmin, web)
```
## Dependências

As dependências do projeto estão listadas no arquivo `requirements.txt`:
```
Flask==3.0.2
SQLAlchemy==2.0.29
mysql-connector-python==8.4.0
firebase-admin==6.4.0
python-dotenv==1.0.1
```
Para instalar as dependências (recomendado em um ambiente virtual):
```
bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
## Configuração `.env`

A API utiliza variáveis de ambiente para configuração, carregadas através do arquivo `.env` localizado na raiz do projeto principal (fora da pasta `api/`). Crie este arquivo caso ele não exista:
```
DATABASE_URL=mysql+mysqlconnector://root:root@db:3306/ementas
FIREBASE_PROJECT_ID=seu-project-id-do-firebase
FIREBASE_PRIVATE_KEY_ID=sua-private-key-id-do-firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=seu-client-email-do-firebase
```
O arquivo `api/config.py` é responsável por carregar essas variáveis.

## Ponto de Entrada (`app.py`)

O arquivo `api/app.py` contém a inicialização da aplicação Flask, a configuração da sessão do SQLAlchemy, a inicialização do Firebase Admin SDK e a definição dos endpoints da API.

Endpoints essenciais incluídos:

- `GET /api/v1/allergens`: Retorna a lista de alergênicos.
- `GET /api/v1/dishes`: Retorna a lista de pratos (utilizando a view `vw_dishes_allergens`).
- `GET /api/v1/menus/public/weekly`: Retorna o menu semanal público (utilizando a view `vw_weekly_menu`).
- `POST /api/v1/users`: Exemplo de endpoint protegido por autenticação `@require_admin` para criação de usuários.

## Decorador de Autenticação (`auth.py`)

O arquivo `api/auth.py` implementa o decorador `@require_admin` que verifica a validade de um ID Token do Firebase enviado no cabeçalho `Authorization` e garante que o usuário associado ao token tenha a role 'admin'.

## Docker Compose

O arquivo `api/docker-compose.yml` define os serviços necessários para rodar a stack completa, incluindo a API (`api`), o banco de dados MariaDB (`db`), o phpMyAdmin para gerenciamento do banco de dados (`phpmyadmin`) e um serviço web (`web`) (assumindo que o frontend reside em `./web`).

## Execução Rápida

### Desenvolvimento Local (com hot-reload)

Certifique-se de estar na raiz do projeto onde o arquivo `.env` está localizado e com o ambiente virtual ativado.
```
bash
export FLASK_APP=api/app.py
flask run -p 8000 --debug
```
A API estará disponível em `http://127.0.0.1:8000`.

### Com Docker

Na raiz do projeto principal (onde o `docker-compose.yml` está):
```
bash
docker compose up --build
```
A API estará disponível na porta 8000 (conforme configurado no `docker-compose.yml`). O phpMyAdmin estará disponível na porta 8081.