FROM mysql:8.0

# Copiamos o conf e os seeds
COPY app/cnf/my.cnf /etc/mysql/conf.d/
COPY app/init/      /docker-entrypoint-initdb.d/

# Garante permissões de leitura
RUN chmod 644 /etc/mysql/conf.d/my.cnf \
    && chmod 644 /docker-entrypoint-initdb.d/*.sql
