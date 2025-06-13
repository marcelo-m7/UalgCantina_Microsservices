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
Use a chave `VITE_FUNCTION_URL` para que o build do Vite injete o endereço da função nas páginas.

## Build da WebApp

Dentro de `webapp/` execute:

```bash
npm install
npm run build # utiliza Vite para gerar os ficheiros em webapp/dist
```

Os ficheiros gerados ficarão em `webapp/dist`.

## Desdobramento para a VM/Container

Defina a variável `VITE_FUNCTION_URL` no ficheiro `.env` dentro de `webapp/` (ou
exporte-a no mesmo terminal) antes de executar `npm run build` para que o valor
seja injetado no HTML. Em seguida copie o conteúdo de `webapp/dist` para a
máquina ou container que irá servir a aplicação, por exemplo:

```bash
scp -r webapp/dist/* usuario@host:/var/www/html/
```

Copie também a pasta `dashboard/web` para o mesmo diretório para que o
dashboard seja disponibilizado junto com a webapp.

## Execução local da Function

Dentro de `functions/` instale as dependências e utilize o Azure Functions Core Tools:

```bash
npm install
func start
```
O endpoint `GET /visits` pode ser testado localmente com:

```bash
curl http://localhost:7071/api/visits
```

## Desdobramento

Os scripts em `scripts/` exemplificam como utilizar Azure CLI para enviar os artefatos.

## Provisionamento da Infraestrutura

Para criar todos os recursos Azure utilize o script de Terraform. Defina o nome
do Resource Group e a senha da VM nas variáveis de ambiente:

```bash
export RESOURCE_GROUP=my-cantina-rg
export ADMIN_PASSWORD='<SENHA_VM>'
scripts/deploy_infra.sh
```

Após a execução é possível obter os endpoints e strings de conexão com:

```bash
cd infrastructure/terraform
terraform output
```

Serão exibidos o endereço público da VM (`vm_public_ip`), a URL da Function
(`function_url`) e a connection string do Storage (`storage_connection_string`).
