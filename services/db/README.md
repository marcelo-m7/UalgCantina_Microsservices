# 📦 Banco de Dados — UAlg Cantina

Este diretório contém os arquivos SQL necessários para criar e popular o banco de dados da aplicação **Cantina da Universidade do Algarve**. Ele é usado pelos microserviços para armazenar usuários, pratos, alérgenos e ementas semanais.

## 🛠️ Tecnologias

- **MySQL** ou **MariaDB**
- Estrutura compatível com `docker-entrypoint-initdb.d` (caso use Docker)

---

## Rede

- API (Contentor)
    URL: https://ualgcantina-api-847590019108.europe-west1.run.app/

    Variáveis:
    ```
    MYSQL_USER=cantina_user
    MYSQL_PASSWORD=
    MYSQL_HOST=ualg-cantina-a79433:northamerica-northeast2:cantinacas-tdb
    MYSQL_PORT=3306
    MYSQL_DB=cantina_db
    FIREBASE_PROJECT_ID=ualg-cantina
    ```

- Banco de Dados MySQL (Cloud SQL Instance):
    ```
    Nome da conexão
    ualg-cantina-a79433:northamerica-northeast2:cantinacas-tdb 
    
    Conectividade de IP particular
    Ativado
        Rede associada
        projects/ualg-cantina-a79433/global/networks/default 
        Rede
        default
        Método de conexão de serviço
        Acesso privado a serviços
        Intervalo de IP alocado
        Intervalo de IPs atribuído automaticamente
        Endereço IP interno
        10.81.16.3
    Conectividade de IP público
    Ativado
        Endereço IP público
        34.130.199.30 
    ```

---

## 📁 Estrutura

- `01_schema.sql`: Criação do banco de dados `cantina_db`
- `02_tables.sql`: Criação das tabelas (`users`, `dishes`, `allergens`, etc.)
- `03_seeds.sql`: Dados de exemplo para testes (pratos, alérgenos e menus)

---

## 🚀 Inicialização com Docker

Se estiver usando Docker com um container de banco de dados (ex: `mysql:8`), os scripts devem estar montados no caminho:

```dockerfile
COPY ./services/db/init /docker-entrypoint-initdb.d
