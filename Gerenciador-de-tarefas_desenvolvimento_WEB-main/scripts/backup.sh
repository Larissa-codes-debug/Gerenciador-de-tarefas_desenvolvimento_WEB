#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p backups
D=$(date +%F_%H%M)

docker compose exec -T postgres pg_dump -U postgres -d gerenciador_tarefas -Fc > "backups/pg_$D.dump"

docker compose exec -T mongodb sh -c \
 'mongodump --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin --db gerenciador_tarefas --archive --gzip' > "backups/mongo_$D.archive.gz"

find backups -type f -mtime +14 -delete
echo "Backup concluído: $D"