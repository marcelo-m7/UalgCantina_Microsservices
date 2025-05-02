# API de Ementas (FastAPI)

Esta aplicação implementa uma API REST profissional em FastAPI seguindo boas práticas de organização de camadas (routers, schemas, models, crud, core).

## Configuração

1. Clone/copie este repositório e instale as dependências  
   ```bash
   pip install -r requirements.txt
   ```

2. Copie `.env.example` para `.env` e ajuste as variáveis de ligação MySQL.

3. Execute a aplicação  
   ```bash
   uvicorn app.main:app --reload
   ```

A documentação interactiva Swagger/OpenAPI estará disponível em `http://localhost:8000/docs`.

> **Nota:** A criação de tabelas é automática no primeiro arranque. Em produção, recomenda‑se usar migrations (Alembic) para versionar o esquema.
