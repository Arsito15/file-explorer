COMPOSE = docker compose

.PHONY: help up down build rebuild logs ps restart clean test

help:
	@echo Available commands:
	@echo   make up       - Build and start containers
	@echo   make down     - Stop and remove containers
	@echo   make build    - Build containers
	@echo   make rebuild  - Rebuild containers without cache
	@echo   make logs     - Show container logs
	@echo   make ps       - Show running services
	@echo   make restart  - Restart the stack
	@echo   make clean    - Stop containers and remove volumes
	@echo   make test     - Run api and frontend tests

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) build --no-cache

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

restart: down up

clean:
	$(COMPOSE) down -v

test:
	cd api && npm test
	cd frontend && npm test
