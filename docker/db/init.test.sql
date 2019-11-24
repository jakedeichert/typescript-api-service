-- Always start fresh
DROP DATABASE IF EXISTS test_db_name;

CREATE DATABASE test_db_name;
GRANT ALL PRIVILEGES ON DATABASE test_db_name TO CURRENT_USER;
