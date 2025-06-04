# Relatório do Projeto CantinaCast

**Aluno:** Marcelo Santos (`a79433@ualg.pt`)

Este relatório descreve o desenvolvimento do projeto **CantinaCast**, uma aplicação web baseada em microsserviços para gestão de ementas na Universidade do Algarve. O trabalho segue os requisitos do "Trabalho 2 de Computação em Nuvem 2024/25".

## Objetivo

Construir um sistema que permita gerir pratos, alérgenos e ementas semanais através de uma API e disponibilizar essas informações num website. O projeto utiliza contentores Docker para cada serviço e autenticação via Firebase.

## Arquitetura

- **Frontend**: Next.js/React com Tailwind CSS, distribuído em container Docker.
- **Backend**: FastAPI (Python) com SQLAlchemy, também containerizado.
- **Base de Dados**: MySQL com scripts SQL de criação de tabelas e dados iniciais.
- **Orquestração**: Docker Compose coordena os serviços `web`, `api` e `db`.

O repositório inclui os arquivos `docker-compose.yml`, Dockerfiles para cada serviço e scripts SQL em `services/db/init`.

## Principais Funcionalidades

- CRUD de alérgenos, pratos e ementas semanais.
- Interface pública para consulta da ementa da semana.
- Autenticação de administradores via Firebase.
- Estrutura preparada para expansão com funcionalidades de IA (sugestões de menus) e CI/CD.

## Como Executar

1. Copiar `.env.example` para `.env` e definir as variáveis necessárias (credenciais de base de dados e chaves do Firebase).
2. Executar `docker-compose up --build` para criar e iniciar os containers.
3. Aceder ao frontend em `http://localhost:3000` e à documentação da API em `http://localhost:8000/docs`.

## Considerações Finais

O CantinaCast cumpre os requisitos principais do trabalho prático, permitindo gerir de forma centralizada a ementa da cantina. A solução é escalável graças à utilização de microsserviços Dockerizados e pode ser estendida com testes automatizados, CI/CD e funcionalidades de IA.

