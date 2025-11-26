.PHONY: help install migrate migrate-undo migrate-reset seed seed-undo dev-backend dev-frontend dev

# Default target
help:
	@echo "CNR Development Commands"
	@echo "========================"
	@echo ""
	@echo "Setup:"
	@echo "  make install        - Install all dependencies (frontend + backend)"
	@echo ""
	@echo "Database:"
	@echo "  make migrate        - Run pending migrations"
	@echo "  make migrate-undo   - Undo last migration"
	@echo "  make migrate-reset  - Reset database (undo all, migrate, seed)"
	@echo "  make seed           - Run all seeders"
	@echo "  make seed-undo      - Undo all seeders"
	@echo ""
	@echo "Development:"
	@echo "  make dev-backend    - Start backend dev server"
	@echo "  make dev-frontend   - Start frontend dev server"
	@echo ""
	@echo "First Time Setup:"
	@echo "  make setup          - Install deps, run migrations and seeders"

# Install dependencies
install:
	cd frontend && npm install
	cd webserver && npm install

# Database migrations
migrate:
	cd webserver && npm run db:migrate

migrate-undo:
	cd webserver && npm run db:migrate:undo

migrate-undo-all:
	cd webserver && npm run db:migrate:undo:all

migrate-reset:
	cd webserver && npm run db:reset

seed:
	cd webserver && npm run db:seed

seed-undo:
	cd webserver && npm run db:seed:undo

# Development servers
dev-backend:
	cd webserver && npm run dev

dev-frontend:
	cd frontend && npm run dev -- --host

# First time setup
setup: install migrate seed
	@echo ""
	@echo "Setup complete!"
	@echo "Run 'make dev-backend' and 'make dev-frontend' in separate terminals."
