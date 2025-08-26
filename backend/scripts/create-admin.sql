-- create-admin.sql
-- Usage: run this against your Postgres database (psql or pgAdmin)
-- Replace 'auth0|ADMIN_SUB' with the actual Auth0 user sub for your admin account.

INSERT INTO users (name, email, role, auth0_id)
VALUES ('Admin Name', 'admin@example.com', 'admin', 'auth0|ADMIN_SUB');
