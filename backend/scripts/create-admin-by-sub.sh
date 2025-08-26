#!/usr/bin/env bash
# Usage: create-admin-by-sub.sh <AUTH0_SUB> <EMAIL> <NAME>
# Requires psql in PATH and PG* env vars set (PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT)

if [ -z "$1" ]; then
  echo "Usage: $0 <AUTH0_SUB> <EMAIL> <NAME>"
  exit 1
fi
AUTH0_SUB="$1"
EMAIL="$2"
NAME="$3"

psql -v ON_ERROR_STOP=1 -c "INSERT INTO users (name, email, role, auth0_id) VALUES ('$NAME', '$EMAIL', 'admin', '$AUTH0_SUB');"

echo "Admin user created (if not exists)."
