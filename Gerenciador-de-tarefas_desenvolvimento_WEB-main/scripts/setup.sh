#!/usr/bin/env bash
set -euo pipefail
docker compose up --build -d
echo "Aguardando backend ficar saudável..."
until [ "$(docker inspect -f '{{.State.Health.Status}}' "$(docker compose ps -q backend)")" = "healthy" ]; do sleep 3; done
docker compose exec backend npm run db:init
docker compose exec backend npm run seed
docker compose ps