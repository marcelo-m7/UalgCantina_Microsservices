FROM mysql:8.0

# Copia configuração + scripts de inicialização
COPY app/cnf/my.cnf               /etc/mysql/conf.d/
COPY app/init/                    /docker-entrypoint-initdb.d/

# Corrige permissões para evitar avisos
RUN chmod 644 /etc/mysql/conf.d/my.cnf

# Corrige permissões para evitar avisos
RUN chmod 644 /docker-entrypoint-initdb.d/*.sql