
# CantinaCast - Sistema de Gestão de Ementas da UAlg

## 1. Visão Geral

O CantinaCast é um sistema integrado projetado para gerir e apresentar as ementas semanais da cantina da Universidade do Algarve. Ele oferece uma interface pública para consulta de ementas com filtros de alérgenos e um painel administrativo para gestão completa de ementas, pratos e alérgenos, incluindo sugestões de ementas assistidas por IA.

### Funcionalidades Chave:

*   **Consulta Pública de Ementas**: Interface amigável para visualização da ementa semanal, com capacidade de filtrar pratos com base em alérgenos selecionados.
*   **Painel de Administração**:
    *   Gestão CRUD (Criar, Ler, Atualizar, Apagar) para Ementas, Pratos e Alérgenos.
    *   Interface intuitiva para montar as ementas diárias (almoço e jantar).
*   **Sugestões de Ementas com IA**: Ferramenta que utiliza Genkit e IA generativa (Google Gemini) para sugerir combinações de pratos (prato principal e acompanhamento) com base na compatibilidade nutricional e popularidade.
*   **Autenticação Segura**: Autenticação de administradores via Firebase (Google Sign-In). O acesso ao painel de administração é restrito a utilizadores autorizados (verificação de e-mail no backend).
*   **Design Responsivo**: Interface adaptável para utilização em desktops e dispositivos móveis.

## 2. Stack Tecnológica

*   **Frontend**:
    *   Framework: Next.js 15 (App Router)
    *   Linguagem: React, TypeScript
    *   Estilização: Tailwind CSS
    *   Componentes UI: ShadCN UI
    *   Gestão de Estado do Servidor: React Query (TanStack Query v5)
    *   Cliente HTTP: Axios
    *   Inteligência Artificial (Frontend): Genkit (para invocar fluxos)
*   **Autenticação (Frontend)**: Firebase Authentication (Google Sign-In)
*   **Inteligência Artificial (Core)**: Genkit com Google AI (Gemini)
*   **Deployment (Frontend)**: Docker (Node.js + Nginx como reverse proxy e para servir ficheiros estáticos)
*   **Backend Esperado**:
    *   Framework: FastAPI (Python)
    *   Autenticação (Backend): Verificação de Firebase ID Token com `firebase-admin`.
    *   Base de Dados Esperada: MariaDB

## 3. Estrutura do Projeto Frontend (`src/`)

```
.
├── app/                      # Next.js App Router: páginas e layouts
│   ├── (admin)/              # Rotas e layouts do painel de administração
│   │   ├── admin/
│   │   │   ├── ai-suggestions/
│   │   │   ├── allergens/
│   │   │   ├── dishes/
│   │   │   ├── menus/
│   │   │   └── settings/
│   │   └── layout.tsx
│   ├── (public)/             # Rotas e layouts públicos
│   │   ├── login/
│   │   ├── menu/
│   │   └── layout.tsx
│   ├── favicon.ico
│   ├── globals.css           # Estilos globais e tema ShadCN/Tailwind
│   ├── layout.tsx            # Layout raiz da aplicação
│   └── page.tsx              # Página inicial (redireciona para /menu)
├── components/               # Componentes React reutilizáveis
│   ├── ui/                   # Componentes ShadCN UI
│   ├── admin-sidebar.tsx
│   ├── auth-provider.tsx
│   ├── icons.tsx
│   ├── public-header.tsx
│   └── query-provider.tsx
├── hooks/                    # Hooks React personalizados
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                      # Lógica core, tipos, config Firebase, etc.
│   ├── api-client.ts         # Cliente Axios configurado
│   ├── firebase.ts           # Configuração do Firebase
│   ├── mock-data.ts          # (Usado anteriormente, agora substituído por API)
│   ├── types.ts              # Definições de tipos TypeScript
│   └── utils.ts              # Funções utilitárias (ex: cn)
├── services/                 # Funções para interagir com a API backend
│   ├── allergenService.ts
│   ├── dishService.ts
│   └── menuService.ts
├── ai/                       # Configuração e fluxos Genkit
│   ├── dev.ts
│   ├── flows/
│   │   └── suggest-menu-pairings.ts
│   └── genkit.ts
├── .env                      # Variáveis de ambiente (não versionado)
├── Dockerfile                # Configuração Docker para o frontend
├── next.config.ts            # Configuração do Next.js
├── nginx.conf                # Configuração do Nginx para Docker
├── supervisord.conf          # Configuração do Supervisor para Docker
└── tailwind.config.ts        # Configuração do Tailwind CSS
```

## 4. Entidades Principais e Interação com API

A aplicação frontend interage com uma API backend (espera-se FastAPI) para gerir os dados. A URL base da API é configurada pela variável de ambiente `NEXT_PUBLIC_API_URL`.

### 4.1. Alérgenos (`Allergen`)

*   **Descrição**: Representa substâncias que podem causar reações alérgicas.
*   **Campos (TypeScript - `src/lib/types.ts`)**:
    *   `id: string`
    *   `name: string`
    *   `icon?: string` (Nome do ícone Lucide React, ex: "Wheat")
    *   `description?: string`
*   **Gestão de Estado (React Query)**: Chave principal `['allergens']`.
*   **Serviço Frontend**: `src/services/allergenService.ts`
*   **Endpoints da API Esperados**:
    *   `GET /allergens/`
        *   Descrição: Busca todos os alérgenos.
        *   Resposta Esperada: `Allergen[]`
    *   `POST /allergens/`
        *   Descrição: Cria um novo alérgeno.
        *   Corpo da Requisição: `Omit<Allergen, 'id'>`
        *   Resposta Esperada: `Allergen` (com o novo `id` atribuído pelo backend)
    *   `PUT /allergens/{id}`
        *   Descrição: Atualiza um alérgeno existente.
        *   Corpo da Requisição: `Partial<Omit<Allergen, 'id'>>`
        *   Resposta Esperada: `Allergen` (atualizado)
    *   `DELETE /allergens/{id}`
        *   Descrição: Remove um alérgeno.
        *   Resposta Esperada: Status `204 No Content` ou similar.

### 4.2. Pratos (`Dish`)

*   **Descrição**: Itens alimentares servidos na cantina.
*   **Campos (TypeScript - `src/lib/types.ts`)**:
    *   `id: string`
    *   `name: string`
    *   `type: DishType` (Enum: 'carne', 'peixe', 'vegetariano', 'vegan', 'sobremesa', 'sopa', 'bebida')
    *   `description?: string`
    *   `price: number`
    *   `kcals?: number | null`
    *   `allergenIds?: string[]` (IDs dos alérgenos associados)
*   **Gestão de Estado (React Query)**: Chave principal `['dishes']`.
*   **Serviço Frontend**: `src/services/dishService.ts`
*   **Endpoints da API Esperados**:
    *   `GET /dishes/`
        *   Descrição: Busca todos os pratos.
        *   Resposta Esperada: `Dish[]`. A API deve retornar `price` como um número (ou string convertível) e `kcals` como número (ou string convertível para int ou null).
    *   `POST /dishes/`
        *   Descrição: Cria um novo prato.
        *   Corpo da Requisição: `Omit<Dish, 'id' | 'allergens' | 'icon'> & { allergenIds?: string[] }` (O campo `icon` é derivado no frontend).
        *   Resposta Esperada: `Dish` (com o novo `id`).
    *   `PUT /dishes/{id}`
        *   Descrição: Atualiza um prato existente.
        *   Corpo da Requisição: `Partial<Omit<Dish, 'id' | 'allergens' | 'icon'> & { allergenIds?: string[] }>`
        *   Resposta Esperada: `Dish` (atualizado).
    *   `DELETE /dishes/{id}`
        *   Descrição: Remove um prato.
        *   Resposta Esperada: Status `204 No Content`.

### 4.3. Ementas (`WeeklyMenu`, `DayMenu`, `MenuEntry`)

*   **Descrição**: Define o calendário semanal de refeições.
    *   `WeeklyMenu`: Representa a ementa de uma semana completa.
        *   Campos: `weekId: string`, `startDate: string` (YYYY-MM-DD), `endDate: string` (YYYY-MM-DD), `days: DayMenu[]`.
    *   `DayMenu`: Representa as refeições de um dia específico.
        *   Campos: `date: string` (YYYY-MM-DD), `lunch?: MenuEntry`, `dinner?: MenuEntry`.
    *   `MenuEntry`: Representa uma refeição individual (almoço ou jantar).
        *   Campos: `id: string`, `date: string`, `mealType: 'almoco' | 'jantar'`, `mainDishId: string`, `mainDish?: Dish` (objeto `Dish` resolvido), `altDishId?: string`, `altDish?: Dish`, `dessertId: string`, `dessert?: Dish`, `sopaId?: string`, `sopa?: Dish`, `notes?: string`.
*   **Gestão de Estado (React Query)**:
    *   `['publicWeeklyMenu']`: Para a ementa pública.
    *   `['adminWeeklyMenu']`: Para a ementa no painel de administração.
    *   `['dishes']`: Usado para popular seletores de pratos na gestão de ementas.
*   **Serviço Frontend**: `src/services/menuService.ts`
*   **Endpoints da API Esperados**:
    *   `GET /public/weekly/`
        *   Descrição: Busca a ementa semanal atual para visualização pública.
        *   Resposta Esperada: `WeeklyMenu`. A API deve retornar os objetos `Dish` completos (sopa, prato principal, alternativo, sobremesa) dentro de cada `MenuEntry`.
    *   `GET /menus/weekly-admin/` (ou similar para admin)
        *   Descrição: Busca a ementa semanal atual para o painel de administração.
        *   Resposta Esperada: `WeeklyMenu` (com objetos `Dish` resolvidos).
    *   `PUT /menus/day/{date}/{mealType}`
        *   Descrição: Atualiza uma entrada de ementa (almoço ou jantar) para um dia específico.
        *   Corpo da Requisição (`MenuEntryUpdatePayload`): `{ date: string, mealType: 'lunch' | 'dinner', sopaId?: string | null, mainDishId: string, altDishId?: string | null, dessertId: string, notes?: string }`.
        *   Resposta Esperada: `DayMenu` (o dia atualizado, com objetos `Dish` resolvidos).

## 5. Autenticação

*   **Provedor**: Firebase Authentication, configurado para Google Sign-In.
*   **Fluxo**:
    1.  O utilizador clica no botão "Login com Google" na página `/login`.
    2.  O `AuthProvider` (`src/components/auth-provider.tsx`) inicia o fluxo de login com o popup do Google através do SDK do Firebase.
    3.  Após o login bem-sucedido, o Firebase retorna um ID Token (JWT) para o frontend.
    4.  O `AuthProvider` armazena o estado do utilizador (incluindo o ID Token, que é acessado via `auth.currentUser.getIdToken()`).
    5.  O cliente Axios (`src/lib/api-client.ts`) possui um interceptor que, antes de cada requisição para a API backend, obtém o ID Token do utilizador atual e o adiciona ao cabeçalho `Authorization` como `Bearer <ID_TOKEN>`.
    6.  O backend (FastAPI) é responsável por:
        *   Receber o ID Token.
        *   Verificá-lo utilizando o SDK `firebase-admin`.
        *   Após a verificação bem-sucedida do token, consultar uma tabela `users` na base de dados para verificar se o e-mail do utilizador autenticado existe e possui a permissão necessária (ex: `role: 'admin'` ou `'editor'`).
        *   Conceder ou negar acesso ao recurso solicitado com base nessa verificação.
*   **Proteção de Rotas (Frontend)**:
    *   O `AdminLayout` (`src/app/(admin)/layout.tsx`) usa o `useAuth` hook para verificar se o utilizador está autenticado.
    *   Se não houver utilizador ou o estado ainda estiver a carregar, ele pode exibir um loader ou redirecionar para `/login`.

## 6. Sugestões de Ementas com IA

*   **Tecnologia**: Genkit com um modelo de linguagem grande (LLM) do Google AI (Gemini).
*   **Fluxo**: `src/ai/flows/suggest-menu-pairings.ts`
    *   **Entrada (`SuggestMenuPairingsInput`)**:
        *   `mainDish: string`: Nome do prato principal.
        *   `availableSideDishes: string[]`: Lista de nomes de acompanhamentos disponíveis.
    *   **Processo**:
        1.  A página de Sugestões AI (`src/app/(admin)/admin/ai-suggestions/page.tsx`) recolhe a entrada do utilizador.
        2.  Invoca a função `suggestMenuPairings` do fluxo Genkit.
        3.  O fluxo Genkit formata um prompt para o LLM, instruindo-o a sugerir o melhor acompanhamento com base na compatibilidade nutricional e popularidade passada, considerando os pratos fornecidos.
    *   **Saída (`SuggestMenuPairingsOutput`)**:
        *   `suggestedSideDish: string`: O nome do acompanhamento sugerido.
        *   `reasoning: string`: A justificação da IA para a sugestão.
*   **Interface**: A página de Sugestões AI permite ao administrador inserir um prato principal, selecionar acompanhamentos disponíveis (carregados da API) e receber a sugestão.

## 7. Componentes UI e Estilização

*   **ShadCN UI**: Biblioteca de componentes utilizada como base para a maioria dos elementos da interface (Botões, Cards, Tabelas, Diálogos, Seletores, Inputs, etc.). Os componentes são personalizáveis e acessíveis. Ficheiros em `src/components/ui/`.
*   **Tailwind CSS**: Framework CSS utility-first para estilização rápida e consistente. Configurado em `tailwind.config.ts` e os estilos base/tema em `src/app/globals.css`.
*   **Componentes Personalizados**:
    *   `AdminSidebar`: Barra lateral de navegação para o painel de administração.
    *   `PublicHeader`: Cabeçalho para as páginas públicas.
    *   `DishTypeIcons`, `getAllergenIcon` (`src/components/icons.tsx`): Mapeamento de tipos de pratos e nomes de alérgenos para ícones Lucide React.
*   **Responsividade**: O layout e os componentes são desenhados para funcionar em diferentes tamanhos de ecrã.

## 8. Configuração de Ambiente e Execução

### 8.1. Pré-requisitos

*   Node.js (v20 ou superior recomendado)
*   npm ou yarn

### 8.2. Configuração do Firebase

1.  Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2.  Adicione um aplicativo da Web ao seu projeto.
3.  Copie as credenciais de configuração do Firebase.
4.  Atualize o ficheiro `src/lib/firebase.ts` com estas credenciais.
5.  No Firebase Console, vá para "Authentication" -> "Sign-in method".
6.  Ative o provedor "Google".
7.  Em "Authentication" -> "Settings" -> "Authorized domains", adicione os domínios que usará para desenvolvimento (ex: `localhost`) e produção.

### 8.3. Variáveis de Ambiente

Crie um ficheiro `.env` na raiz do projeto com o seguinte conteúdo (substitua pelos seus valores):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Variáveis opcionais para Genkit/Google AI, se o frontend fizer chamadas diretas
# Normalmente, a chave de API do Google AI é gerida pelo backend ou pelo ambiente de execução do Genkit.
# GOOGLE_API_KEY=SUA_GOOGLE_API_KEY
```

*   `NEXT_PUBLIC_API_URL`: A URL base da sua API backend (FastAPI).

### 8.4. Instalação de Dependências

```bash
npm install
# ou
yarn install
```

### 8.5. Executar em Modo de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em `http://localhost:9002` (ou a porta definida no script `dev` em `package.json`).

### 8.6. Scripts Disponíveis

*   `dev`: Inicia o servidor de desenvolvimento Next.js (com Turbopack).
*   `genkit:dev`: Inicia o Genkit em modo de desenvolvimento (se necessário para testar fluxos localmente).
*   `build`: Compila a aplicação para produção.
*   `start`: Inicia um servidor de produção Next.js (após `build`).
*   `lint`: Executa o ESLint.
*   `typecheck`: Executa o verificador de tipos TypeScript.

## 9. Deployment (Docker)

O frontend está configurado para ser "dockerizado" usando um `Dockerfile` multi-stage.

*   **Estágio de Build**: Usa `node:20-alpine` para instalar dependências e construir a aplicação Next.js (`output: 'standalone'` é usado em `next.config.js` para otimizar a saída para Docker).
*   **Estágio de Runtime**: Usa `node:20-alpine`, instala Nginx e Supervisor.
    *   Nginx (`nginx.conf`) atua como reverse proxy para a aplicação Next.js e serve ficheiros estáticos.
    *   Supervisor (`supervisord.conf`) gere os processos Nginx e Node.js (aplicação Next.js).
*   **`docker-compose.yml` (Exemplo para o projeto maior)**:
    ```yaml
    version: '3.9'
    services:
      frontend:
        build:
          context: ./frontend # Caminho para a pasta do projeto Next.js
          dockerfile: Dockerfile
        ports: ["3000:80"] # Mapeia a porta 3000 do host para a porta 80 do contêiner (Nginx)
        environment:
          NEXT_PUBLIC_API_URL: http://api:8000/api/v1 # Exemplo, API acessível internamente como 'api'
        # depends_on: [api] # Se o frontend depende da API

      api:
        build: ./api # Caminho para a pasta do projeto FastAPI
        ports: ["8000:8000"]
        env_file:
          - .env # Para variáveis da API
        # depends_on: [db]

      db:
        image: mariadb:10.11
        environment:
          MARIADB_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
          MARIADB_DATABASE: ementas
          MARIADB_USER: ${DB_USER}
          MARIADB_PASSWORD: ${DB_PASSWORD}
        volumes:
          - db_data:/var/lib/mysql
          # - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql # Para schema inicial

      phpmyadmin:
        image: phpmyadmin
        ports: ["8081:80"] # Porta diferente para phpmyadmin
        environment:
          PMA_HOST: db
          PMA_PORT: 3306
        depends_on: [db]

    volumes:
      db_data:
    ```

## 10. Considerações Futuras e Melhorias

*   **Testes Unitários e de Integração**: Implementar testes com Vitest/Jest e Testing Library.
*   **Testes E2E**: Adicionar testes end-to-end com Playwright ou Cypress.
*   **Paginação e Otimização de Listas**: Para as páginas de gestão de Pratos e Alérgenos, se o número de itens crescer.
*   **Gestão de Utilizadores (Roles/Permissions)**: Expandir a gestão de permissões no frontend e backend.
*   **Dashboard de Métricas**: Implementar visualizações de dados (ex: pratos mais populares).
*   **Internacionalização (i18n)**: Se necessário, adicionar suporte para múltiplos idiomas.
*   **Melhorias de Acessibilidade (a11y)**: Revisão contínua para garantir conformidade.
*   **Optimistic Updates**: Para uma experiência de utilizador mais fluida nas operações CRUD.
```