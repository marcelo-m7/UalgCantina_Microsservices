# Codex Agents Overview

Este documento descreve os agentes Codex responsáveis por cada parte do projeto e as respectivas tarefas atribuídas. As responsabilidades foram extraídas da proposta inicial e organizadas para fácil acompanhamento.

## Agentes e Responsabilidades

### 1. Aplicação Web Agent
- Desenvolver e testar páginas HTML interligadas.
- Utilizar HTML, CSS e JavaScript para compor o site.
- Garantir que cada página chama a Azure Function de registo de visitas.

### 2. Headless Function Agent
- Implementar uma Azure Function (HTTP POST `/track`).
- Registar visitas em Azure Blob Storage ou Table Storage.
- Manter configuração em `local.settings.json` sem credenciais reais.

### 3. Dashboard Agent
- Construir dashboard para visualizar os dados de visitas.
- Pode usar Power BI, Grafana ou bibliotecas JS (ex.: Chart.js).
- Atualizar automaticamente a cada 60 s quando aplicável.

### 4. Infrastructure Agent
- Provisionar recursos Azure (VM/Container, Storage, Function App).
- Fornecer scripts de deploy utilizando AZ CLI.

### 5. Integration & Testing Agent
- Executar testes de integração e validações automatizadas.
- Confirmar que a web app, função e dashboard funcionam em conjunto.

---

Quando um agente finalizar sua parte, deve atualizar os checkboxes em [`Agents.md`](Agents.md) com o commit ou PR correspondente para manter rastreabilidade.
