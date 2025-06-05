# CantinaCast - Sistema de Gestão de Ementas da UAlg

## Visão Geral

O CantinaCast é um sistema web moderno e responsivo para a gestão e visualização das ementas da cantina da Universidade do Algarve (UAlg). O projeto visa fornecer uma plataforma eficiente para administradores gerenciarem alérgenos, pratos e ementas semanais, ao mesmo tempo que oferece aos utilizadores finais uma interface intuitiva para consultar as opções de refeição e, futuramente, obter sugestões personalizadas.

## Funcionalidades Chave

*   **Gestão de Alérgenos**: Cadastro, edição e exclusão de alérgenos com informações detalhadas e ícones.
*   **Gestão de Pratos**: Cadastro, edição e exclusão de pratos, associando-os a tipos (carne, peixe, vegetariano, etc.), preços, informações nutricionais (kcal) e alérgenos.
*   **Gestão de Ementas Semanais**: Definição da ementa para cada dia da semana (almoço e jantar), associando pratos (sopa, prato principal, alternativo, sobremesa).
*   **Visualização Pública da Ementa**: Interface amigável para utilizadores consultarem a ementa da semana atual.
*   **AI Suggestions (Futuro)**: Implementação de um motor de sugestões baseado em IA para auxiliar utilizadores com escolhas de pratos (ex: sugestões de harmonização de pratos).

## Arquitetura

O CantinaCast adota uma arquitetura de microsserviços (ou, neste caso, serviços componentes) Dockerizados:

*   **Frontend**: Desenvolvido com **Next.js (React)** para uma interface de utilizador rápida e dinâmica.
*   **Backend**: Construído com **FastAPI (Python)**, fornecendo uma API robusta e performática para gerenciar os dados.
*   **Banco de Dados**: Utiliza **MySQL** para armazenamento seguro e eficiente dos dados.
*   **Containerização**: Todos os serviços são empacotados e orquestrados usando **Docker** e **Docker Compose**, garantindo ambientes de desenvolvimento e produção consistentes.
*   **Autenticação**: Integração com **Firebase Authentication** para gestão de utilizadores (administradores).
*   **AI (Futuro)**: Utilização de **Vertex AI Genkit** para funcionalidades de IA.

## Entidades Principais e Interação com API

A aplicação interage com a API backend via endpoints RESTful:

### Alérgenos (`Allergen`)

*   Representa substâncias que podem causar reações alérgicas.
*   Campos: `id`, `name`, `icon`, `description`.
*   Endpoints: `GET /allergens/`, `POST /allergens/`, `PUT /allergens/{id}`, `DELETE /allergens/{id}`.

### Pratos (`Dish`)

*   Itens alimentares servidos na cantina.
*   Campos: `id`, `name`, `type`, `description`, `price`, `kcals`, `allergenIds`.
*   Endpoints: `GET /dishes/`, `POST /dishes/`, `PUT /dishes/{id}`, `DELETE /dishes/{id}`.

### Ementas (`WeeklyMenu`, `DayMenu`, `MenuEntry`)

*   Define o calendário semanal de refeições.
*   Campos: `weekId`, `startDate`, `endDate`, `days` (WeeklyMenu); `date`, `lunch`, `dinner` (DayMenu); `id`, `date`, `mealType`, `mainDishId`, `mainDish`, `altDishId`, `altDish`, `dessertId`, `dessert`, `sopaId`, `sopa`, `notes` (MenuEntry).
*   Endpoints: `GET /public/weekly/`, `GET /menus/weekly-admin/`, `PUT /menus/day/{date}/{mealType}`.

## Guia de Dockerização

Este projeto está configurado para ser executado facilmente usando Docker Compose. A estrutura de pastas reflete a separação dos serviços:
```
text
cantinacast/
├── web/               # Frontend Next.js
│   ├── Dockerfile
│   └── ...
├── api/               # Backend FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── db.py
│   ├── auth.py
│   ├── models.py
│   └── routers/
│       ├── allergens.py
│       ├── dishes.py
│       └── menus.py
├── services/
│   ├── db/            # Banco de dados MySQL
│   │   ├── Dockerfile
│   │   └── init/
│   │       ├── 00_init.sql
│   │       ├── 01_tables.sql
│   │       ├── 02_seeds.sql
│   │       └── 03_simple_data.sql
├── .env               # Variáveis de ambiente (NÃO commitar valores sensíveis!)
├── .env.example       # Exemplo de variáveis de ambiente (para commit)
└── docker-compose.yml # Orquestração dos containers
```
*   **web/Dockerfile**: Define a imagem Docker para a aplicação Next.js.
*   **api/Dockerfile**: Define a imagem Docker para o backend FastAPI.
*   **db/Dockerfile**: Define a imagem Docker para o banco de dados MySQL (baseado na imagem oficial).
*   **.env**: Contém as variáveis de ambiente reais (credenciais do DB, URL da API, etc.). **Mantenha este arquivo fora do controle de versão em repositórios públicos.**
*   **.env.example**: Um arquivo de exemplo para as variáveis de ambiente, com placeholders para valores sensíveis.
*   **docker-compose.yml**: Orquestra os três serviços (`web`, `api`, `db`), definindo suas dependências, portas e volumes.


## Como Executar o Projeto com Docker Compose

Certifique-se de ter o Docker e o Docker Compose instalados.

1.  **Configurar Variáveis de Ambiente:** Copie o arquivo `.env.example` para `.env` na raiz do projeto (Já está com as variáveis setadas)
```
bash
    cp .env.example .env
```

2.  **Construir e Iniciar os Serviços:** No terminal, navegue até a pasta raiz do projeto (onde está o `docker-compose.yml`) e execute o seguinte comando:
```
bash
    docker-compose up --build
    
```
Este comando irá construir as imagens Docker para cada serviço (frontend, backend, database) e iniciar os contêineres.

3.  **Verificar os Logs:** Acompanhe os logs no terminal para garantir que todos os serviços iniciaram sem erros.

4.  **Acessar a Aplicação:**

    *   **Frontend:** Abra o navegador em `http://localhost:3000`. Você deverá ver a interface do utilizador (se o frontend já tiver sido implementado).
    *   **API Docs (Swagger UI):** A documentação interativa da API FastAPI está disponível em `http://localhost:8000/docs`. Você pode explorar os endpoints e testá-los diretamente no navegador.
    *   **Banco de Dados:** O banco de dados MySQL estará rodando e acessível internamente pelos contêineres via hostname `db` na porta 3306. Externamente (se desejar conectar com um cliente SQL), pode usar `localhost:3306` com as credenciais definidas no `.env`.

Para parar os serviços, pressione `Ctrl+C` no terminal onde o `docker-compose up` está a correr. Para remover os contêineres e redes (mas mantendo os dados do banco), use `docker-compose down`. Para remover contêineres, redes e os dados do banco (volume), use `docker-compose down -v` (use com cuidado!).
