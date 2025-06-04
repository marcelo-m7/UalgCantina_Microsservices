# CantinaCast - Sistema de Gestão de Ementas da UAlg

## Visão Geral

O CantinaCast é um sistema web moderno e responsivo para a gestão e visualização das ementas da cantina da Universidade do Algarve (UAlg). O projeto visa fornecer uma plataforma eficiente para administradores gerenciarem alérgenos, pratos e ementas semanais, ao mesmo tempo que oferece aos utilizadores finais uma interface intuitiva para consultar as opções de refeição e, futuramente, obter sugestões personalizadas.

## Funcionalidades Chave

*   **Gestão de Alérgenos**: Cadastro, edição e exclusão de alérgenos com informações detalhadas e ícones.
*   **Gestão de Pratos**: Cadastro, edição e exclusão de pratos, associando-os a tipos (carne, peixe, vegetariano, etc.), preços, informações nutricionais (kcal) e alérgenos.
*   **Gestão de Ementas Semanais**: Definição da ementa para cada dia da semana (almoço e jantar), associando pratos (sopa, prato principal, alternativo, sobremesa).
*   **Visualização Pública da Ementa**: Interface amigável para utilizadores consultarem a ementa da semana atual.
*   **AI Suggestions (Futuro)**: Implementação de um motor de sugestões baseado em IA para auxiliar utilizadores com escolhas de pratos (ex: sugestões de harmonização de pratos).

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
