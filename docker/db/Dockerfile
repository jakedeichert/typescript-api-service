FROM postgres:12.1-alpine

# Initializes postgres with databases
COPY init.sql init.test.sql /docker-entrypoint-initdb.d/
