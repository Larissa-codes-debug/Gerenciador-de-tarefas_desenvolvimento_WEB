#!/usr/bin/env bash
set -u
fail=0
for svc in postgres mongodb backend frontend proxy; do
  id=$(docker compose ps -q "$svc")
  st=$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$id" 2>/dev/null || echo "ausente")
  printf '%-10s %s\n' "$svc" "$st"
  { [ "$st" = "healthy" ] || [ "$st" = "running" ]; } || fail=1
done
curl -fsk "https://${DOMAIN:-localhost}/api/ready" >/dev/null && echo "API ready: OK" || { echo "API ready: FALHOU"; fail=1; }
exit $fail