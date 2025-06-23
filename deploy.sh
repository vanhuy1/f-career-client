docker compose down || true
export COMPOSE_BAKE=true
docker compose up -d --remove-orphans