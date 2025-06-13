# Agents — Trabalho Prático Azure Web + Function + Dashboard

> **Propósito**: Distribuir claramente responsabilidades, caminhos de entrega e tarefas iniciais para cada agente Codex que atuará no desenvolvimento deste projeto.

---

## 1. Visão Geral Rápida

| Agente                          | Objetivo Primário                                                 | Diretório de Entrega           | Dependências                             |
| ------------------------------- | ----------------------------------------------------------------- | ------------------------------ | ---------------------------------------- |
| **Infrastructure Agent**        | Provisionar VM/Container, Storage e Function App na Azure via IaC | `/infrastructure`              | Nenhuma                                  |
| **Web App Agent**               | Construir aplicação web (HTML/CSS/JS)                             | `/webapp`                      | Infraestrutura pronta (endereço público) |
| **Headless Function Agent**     | Criar Azure Function que regista visitas                          | `/functions/VisitTracker`      | Storage + Function App                   |
| **Dashboard Agent**             | Conectar-se ao Storage e exibir métricas                          | `/dashboard`                   | Storage populado                         |
| **Integration & Testing Agent** | CI/CD, testes integrados, validação de métricas                   | `/tests`, `/.github/workflows` | Todos os outros módulos                  |

*Observação*: Todas as credenciais ou chaves secretas devem ser referenciadas como placeholders (`<STORAGE_KEY>`) — sem dados sensíveis no repositório.

---

## 2. Tarefas Detalhadas

### 2.1 Infrastructure Agent

* [x] **IaC**: Criar Bicep *ou* Terraform (`main.bicep` ou `main.tf`) que:

  * [ ] Provisiona **Resource Group**.
  * [ ] Cria **Storage Account** com Blob & Table.
  * [ ] Provisiona **Function App** (Node 20 ou Python 3.11).
  * [ ] Cria **VM (Ubuntu LTS)** *ou* **Container App** com plano básico.
* [x] **Scripts**: adicionar `scripts/deploy_*` que chamem AZ CLI.
* [ ] **Output**: Documentar endpoints e connection‑strings no `README`.

### 2.2 Web App Agent

* [x] **Estrutura de Páginas**: criar pelo menos *Home*, *About*, *Contact*.
* [x] **Integração com Function**: em cada carregamento de página, chamar a Azure Function (HTTP POST) para registar visita.
* [x] **Build & Serve**: configurar `vite.config.js` ou equivalente; `npm run build` deve produzir artefatos em `/dist`.
* [x] **README**: instruções de build, variáveis (.env).

### 2.3 Headless Function Agent

* [x] **Endpoint**: HTTP trigger `POST /track` com payload `{ "page": "<slug>" }`.
* [x] **Persistência**: escrever/merge em Blob Storage (`visits/{page}.json`) *ou* Table Storage (`PageVisits`).
* [x] **Counter Lógico**: incrementar visitas atomically (usar ETag/Timestamp ou MergeEntity).
* [x] **Local Settings**: fornecer `local.settings.json` (sem secretos).

### 2.4 Dashboard Agent

* [x] **Fonte de Dados**: ler Blob/Table periodicamente (REST API ou SDK).
* [x] **Visualização**: escolher **Power BI Embedded** *ou* página JS com **Chart.js** (ex.: gráfico de barras por página).
* [x] **Auto‑Refresh**: atualizar a cada 60 s.
* [ ] **Deploy**: se Chart.js, hospedar junto da Web App; se Power BI, fornecer relatório `.pbix` + script embed.

### 2.5 Integration & Testing Agent

* [x] **CI/CD**: configurar workflow GitHub Actions `deploy.yml` que:

  * [x] Instala dependências.
  * [x] Executa testes.
  * [ ] Desencadeia scripts de deploy (`scripts/*`).
* [x] **Testes de API**: cobertura da Function (ex.: `pytest`, `supertest`).
* [x] **Testes E2E**: usar Playwright ou Cypress para navegar entre páginas e validar contadores.
* [ ] **Validação de Dados**: checar que total de visitas no Storage > 0 após testes.

---

## 3. Padrões de Contribuição

1. **Branches**: trabalhar em `feature/<agente>/<tarefa>`; PRs contra `dev`.
2. **PR Template**: descrever objetivo, mudanças, checklist de conclusão.
3. **Commits**: estilo Conventional Commits (`feat:`, `fix:`, `docs:` etc.).
4. **Review**: outro agente deve aprovar PR antes de *merge*.

---

## 4. Cronograma Sugerido

| Semana | Marco                         | Responsável                        |
| ------ | ----------------------------- | ---------------------------------- |
| 1      | Infraestrutura provisionada   | Infrastructure Agent               |
| 2      | Páginas Web + Function mínima | Web App + Headless Function Agents |
| 3      | Dashboard MVP                 | Dashboard Agent                    |
| 4      | Testes & Pipeline OK          | Integration & Testing Agent        |
| 5      | Ajustes finais + Relatório    | Todos                              |

---

## 5. Checklist Global

* [x] Infraestrutura
* [x] Web App
* [x] Azure Function
* [x] Dashboard
* [x] CI/CD & Testes
* [ ] Relatório `/docs/relatorio.pdf`

> **Quando concluir uma tarefa**, marque o checkbox correspondente e mencione o commit/PR relacionado em `agents.md` para rastreabilidade.
