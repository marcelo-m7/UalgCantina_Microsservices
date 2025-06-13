# Proposta de Implementação — Aplicação Web, Função Headless e Dashboard na Azure

> **Contexto**: Este documento apresenta uma proposta detalhada para o trabalho prático solicitado, incluindo organização de pastas/ficheiros no repositório Git, divisão de responsabilidades entre agentes Codex e observações sobre limites da plataforma ChatGPT + Codex.

---

## 1. Visão Geral do Projeto

* **Objetivo**: Disponibilizar uma aplicação Web hospedada em Azure (VM ou contêiner), uma Function *headless* que contabiliza visitas por página HTML e um dashboard para visualização dos dados.
* **Pilares**:

  1. **Infraestrutura** — aprovisionamento de recursos (VM/Container, Storage, Function App).
  2. **Aplicação Web** — site estático SPA/MPA (HTML + CSS + JS).
  3. **Azure Function** — API server‑less para registo de visitas.
  4. **Dashboard** — painel Power BI / Grafana ou Chart.js (self‑hosted) ligado ao Storage.
  5. **Integração & Testes** — pipeline CI/CD, testes E2E.

---

## 2. Tecnologias e Serviços

| Camada          | Opções Recomendas                                                        | Observações                                  |
| --------------- | ------------------------------------------------------------------------ | -------------------------------------------- |
| Hospedagem Web  | Azure VM (Ubuntu LTS) **ou** Azure Container Apps                        | Simplicidade vs custo.                       |
| Armazenamento   | Azure Blob Storage **ou** Azure Table Storage                            | JSON ou entidade por página.                 |
| Função Headless | Azure Functions (Node.js 20 / Python 3.11)                               | Trigger HTTP + autorização nível “function”. |
| Dashboard       | **Power BI Embedded**, Grafana Cloud, **ou** página interna com Chart.js | Escolha final conforme licenciamento.        |
| CI/CD           | GitHub Actions **ou** Azure Pipelines                                    | Automatizar build, test, deploy.             |

---

## 3. Organização de Pastas/Ficheiros

```
/                            # raiz do repositório ─ Git
├─ README.md                 # instruções de setup & execução
├─ agents.md                 # gerado pelo Agente‑Mestre Codex
├─ .github/                  # CI/CD (GitHub Actions) — opcional Azure‑Pipelines/
│   └─ workflows/
│      └─ deploy.yml
├─ infrastructure/           # código de infraestrutura (Bicep/Terraform/Ansible)
│   ├─ bicep/
│   │   └─ main.bicep
│   └─ terraform/
│       └─ main.tf
├─ webapp/                   # aplicação web
│   ├─ public/               # ficheiros estáticos (html, css, img)
│   ├─ src/                  # JS/TS (se SPA, React/Vite opcional)
│   ├─ package.json
│   └─ vite.config.js
├─ functions/                # Azure Function App
│   ├─ VisitTracker/
│   │   ├─ function.json
│   │   ├─ index.js          # ou main.py
│   │   └─ package.json / requirements.txt
│   └─ host.json
├─ dashboard/                # visualização de dados
│   ├─ powerbi/              # ficheiros .pbix / scripts embed
│   ├─ grafana/              # json de dashboards
│   └─ web/                  # Chart.js (se self‑hosted)
├─ scripts/                  # utilitários de build/deploy
│   ├─ deploy_web.sh
│   ├─ deploy_functions.sh
│   └─ setup_storage.ps1
├─ tests/                    # testes automáticos
│   ├─ integration/
│   └─ e2e/
└─ docs/                     # documentação e relatórios
    └─ relatorio.pdf
```

### 3.1 Convenções

* **Lower‑kebab‑case** para pastas.
* **CamelCase** apenas para nomes de Functions.
* **`.env.sample`** na raiz com variáveis necessárias (Chave Storage, URL Function, etc.).

---

## 4. Fluxo de Trabalho com Agentes Codex

| Passo | Agente                          | Entregável                                       | Local no Repo                  |
| ----- | ------------------------------- | ------------------------------------------------ | ------------------------------ |
| 1     | **Infrastructure Agent**        | Bicep/Terraform + scripts de provisionamento     | `/infrastructure`              |
| 2     | **Web App Agent**               | Páginas HTML/CSS/JS + README de build            | `/webapp`                      |
| 3     | **Headless Function Agent**     | Código da Function + `function.json`             | `/functions/VisitTracker`      |
| 4     | **Dashboard Agent**             | Dashboard .pbix / Chart.js app                   | `/dashboard`                   |
| 5     | **Integration & Testing Agent** | Scripts CI/CD + suites PHPUnit/PyTest/Playwright | `/tests`, `/.github/workflows` |

> O arquivo `agents.md` faz referência a cada task detalhada e incluirá check‑list de conclusão.

---

## 5. Limitações da Plataforma ChatGPT + Codex

1. **Sem provisionamento real**: O ambiente Codex não executa comandos Azure CLI nem cria recursos em tempo‑real; o output será scripts/ficheiros prontos para execução no ambiente do utilizador.
2. **Sem acesso secreto**: Variáveis sensíveis serão referenciadas como placeholders (`<STORAGE_KEY>`).
3. **Tamanho de ficheiro**: Manter ficheiros grandes (ex.: imagens, .pbix) fora ou usar Git LFS.
4. **Execução paralela**: Agentes trabalham de forma pseudo‑paralela; dependências entre pastas devem ser clarificadas no `agents.md`.

---

## 6. Próximos Passos

1. **Aprovar estrutura** – confirme se a hierarquia de pastas atende às expectativas.
2. **Gerar `agents.md`** – Agente‑Mestre cria o documento e abre issues/pull‑requests.
3. **Criar branch `dev`** – trabalho inicial acontece em `dev`; merge para `main` após revisão.
4. **Configurar CI/CD** – pipeline valida PRs e faz deploy em *staging*.
5. **Produção** – após testes, promover release para produção.

---

## 7. Entregáveis Finais

* **Código‑fonte completo** no repositório.
* **Relatório** em `/docs/relatorio.pdf` descrevendo:

  1. Configuração de recursos Azure.
  2. Detalhes de desenvolvimento da WebApp, Function e Dashboard.
  3. Guia de execução e acesso.
* **Dashboard** acessível publicamente (ou via link compartilhado).
