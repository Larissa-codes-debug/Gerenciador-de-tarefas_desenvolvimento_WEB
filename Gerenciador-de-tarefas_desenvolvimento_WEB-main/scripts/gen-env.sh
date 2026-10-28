#!/usr/bin/env bash
set -euo pipefail
[ -f .env ] && { echo ".env já existe. Abortando."; exit 1; }
r() { openssl rand -hex 24; }
sed -e "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$(r)|" \
    -e "s|^APP_DB_PASSWORD=.*|APP_DB_PASSWORD=$(r)|" \
    -e "s|^MONGO_ROOT_PASSWORD=.*|MONGO_ROOT_PASSWORD=$(r)|" \
    -e "s|^MONGO_APP_PASSWORD=.*|MONGO_APP_PASSWORD=$(r)|" \
    -e "s|^GRAFANA_ADMIN_PASSWORD=.*|GRAFANA_ADMIN_PASSWORD=$(r)|" \
    .env.example > .env
chmod 600 .env
echo ".env criado."