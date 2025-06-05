# Relatório do Projeto CantinaCast

**Aluno:** Marcelo Santos (`a79433@ualg.pt`)
**Repositório GitHub:** Marcelo Santos (`https://github.com/marcelo-m7/UalgCantina_Microsservices`)

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

1. Para testar o frontend, lembre-se de inserir o email da sua conta Google na tabela `users` do banco de dados.
   ```sql
       INSERT INTO users (name, email, role)
    VALUES
      ('Marcelo Santos', 'marcelosouzasantos77@gmail.com', 'admin');
   ```
3. Copiar `.env.example` para `.env` e definir as variáveis necessárias (credenciais de base de dados e chaves do Firebase).
4. Executar `docker-compose up --build` para criar e iniciar os containers.
5. Aceder ao frontend em `http://localhost:3000` e à documentação da API em `http://localhost:8000/docs`.

## Considerações Finais

Enfrentei dificuldades ao compilar o frontend para execução fora do modo de desenvolvimento. Por esse motivo, no arquivo `services/web/Dockerfile`, a linha `# CMD ["npm", "run", "start"]` está comentada, e o script em execução é o `dev`, que compila as páginas dinamicamente no momento do acesso. Isso pode tornar a navegação um pouco mais lenta nas primeiras visitas. No entanto, o professor pode testar a substituição do script por `start`, o que fará com que o servidor Next.js compile todo o frontend antecipadamente, antes de disponibilizar o acesso à aplicação.

 [*Repositório GitHub*](https://github.com/marcelo-m7/UalgCantina_Microsservices)
