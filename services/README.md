## Como Executar

1. Para testar o frontend, lembre-se de inserir o email da sua conta Google na tabela `users` do banco de dados.
   ```sql
       INSERT INTO users (name, email, role)
    VALUES
      ('Marcelo Santos', 'marcelosouzasantos77@gmail.com', 'admin');
   ```
3. Copiar `.env.example` para `.env`:
   ```
   bash
      cp .env.example .env
   ```
4. Executar `docker-compose up --build` para criar e iniciar os containers.
5. Aceder ao frontend em `http://localhost:3000` e à documentação da API em `https://ualgcantina-api-847590019108.europe-west1.run.app/docs`.

## Considerações Finais

*(Já foi corrigido)* Enfrentei dificuldades ao compilar o frontend para execução fora do modo de desenvolvimento. Por esse motivo, no arquivo `services/web/Dockerfile`, a linha `# CMD ["npm", "run", "start"]` está comentada, e o script em execução é o `dev`, que compila as páginas dinamicamente no momento do acesso. Isso pode tornar a navegação um pouco mais lenta nas primeiras visitas. No entanto, o professor pode testar a substituição do script por `start`, o que fará com que o servidor Next.js compile todo o frontend antecipadamente, antes de disponibilizar o acesso à aplicação.

 [**Repositório GitHub**](https://github.com/marcelo-m7/UalgCantina_Microsservices)
