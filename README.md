# UAlg Cantina Microsservices

Este repositório contém uma prova de conceito para uma aplicação web hospedada na Azure. Inclui uma Azure Function para registo de visitas, um dashboard e infraestrutura definida como código.

## Estrutura do Projeto

- **infrastructure/**  
  Código Bicep ou Terraform para aprovisionar recursos Azure.
- **webapp/**  
  Páginas estáticas e código JavaScript.
- **functions/**  
  Azure Functions (ex.: VisitTracker).
- **dashboard/**  
  Visualização de dados (Power BI, Grafana ou Chart.js).
- **scripts/**  
  Scripts de deploy de recursos.
- **tests/**  
  Testes de integração e E2E.
- **docs/**  
  Relatórios e documentação adicional.

## Requisitos

- Node.js 20+
- Azure CLI (para execução dos scripts de deploy)

## Configuração

Copie o ficheiro `.env.sample` para `.env` e defina as variáveis necessárias:

```bash
cp .env.sample .env
```

As variáveis incluem a string de conexão do Storage e a URL da Azure Function.

## Build da WebApp

Dentro de `webapp/` execute:

```bash
npm install
npm run build
```

Os ficheiros gerados ficarão em `webapp/dist`.

## Execução local da Function

Dentro de `functions/` instale as dependências e utilize o Azure Functions Core Tools:

```bash
npm install
func start
```

## Desdobramento

Os scripts em `scripts/` exemplificam como utilizar Azure CLI para enviar os artefatos.
