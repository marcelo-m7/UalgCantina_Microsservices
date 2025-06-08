gcloud auth configure-docker us-central1-docker.pkg.dev

us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcantina

docker pull us-docker.pkg.dev/marcelom7/ualgcantina_microsservices-api:latest

gcloud auth configure-docker us-central1-docker.pkg.dev
# API
docker pull marcelom7/ualgcantina_microsservices-api:latest 
docker tag marcelom7/ualgcantina_microsservices-api:latest us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcantina

# WEB
docker pull marcelom7/ualgcantina_microsservices-web:latest
docker tag marcelom7/ualgcantina_microsservices-web:latest us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcast/ualgcantina-web:latest

# DB
docker pull marcelom7/ualgcantina_microsservices-db:latest
docker tag marcelom7/ualgcantina_microsservices-db:latest us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcast/ualgcantina-db:latest

docker push us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcantina

docker push us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcast/ualgcantina-web:latest
docker push us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcast/ualgcantina-db:latest



# API (escuta na porta 8000)
docker run -d --name ualgcast/ualgcantina-api -e MYSQL_HOST=ualgcantina-db -e MYSQL_USER=senhaSegura123 -e MYSQL_PASSWORD=senhaSegura123 -e MYSQL_DB=cantina_db -e FIREBASE_PROJECT_ID=ualg-cantina -p 8000:8000 us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcast/ualgcantina-api:latest

# WEB (Next.js, escuta normalmente na 3000)
docker run -d --name ualgcantina-web -e API_URL=http://localhost:8000 -e FIREBASE_PROJECT_ID=ualg-cantina -p 3000:3000 us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcast/ualgcantina-web:latest

# DB (MySQL), se quiser rodar também localmente
docker run -d --name ualgcantina-db -e MYSQL_ROOT_PASSWORD=senhaSegura123 -e MYSQL_DATABASE=cantina_db -p 3306:3306 us-central1-docker.pkg.dev/ualg-cantina-a79433/ualgcast/ualgcantina-db:latest
