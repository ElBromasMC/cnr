# Centro Nutricional Rodríguez (CNR)

A full-stack web application for managing menus and testimonials at a nutrition center.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js 22 + Express + Sequelize ORM
- **Database**: PostgreSQL
- **Authentication**: JWT

## Project Structure

```
.
├── frontend/               # React frontend application
│   ├── src/               # React components, pages, context, hooks
│   ├── public/            # Static assets
│   └── config/            # Axios configuration
├── webserver/             # Node.js/Express backend
│   ├── config/            # Database and email configuration
│   ├── controllers/       # Route handlers
│   ├── db/
│   │   ├── migrations/    # Sequelize migrations
│   │   └── seeders/       # Database seeders
│   ├── helpers/           # Utility functions
│   ├── middleware/        # Auth middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   └── public/            # Landing page assets
├── scripts/               # Entrypoint scripts
├── Makefile               # Development commands
└── .env.example           # Environment variables template
```

## Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your database credentials and settings

# 3. First time setup: install deps, run migrations and seeders
make setup

# 4. Start backend and frontend (in separate terminals)
make dev-backend   # Terminal 1
make dev-frontend  # Terminal 2
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8080`.

## Makefile Commands

Run `make help` to see all available commands:

### Setup
| Command | Description |
|---------|-------------|
| `make install` | Install all dependencies (frontend + backend) |
| `make setup` | First time setup (install, migrate, seed) |

### Database
| Command | Description |
|---------|-------------|
| `make migrate` | Run pending migrations |
| `make migrate-undo` | Undo last migration |
| `make migrate-reset` | Reset database (undo all, migrate, seed) |
| `make seed` | Run all seeders |
| `make seed-undo` | Undo all seeders |

### Development
| Command | Description |
|---------|-------------|
| `make dev-backend` | Start backend dev server |
| `make dev-frontend` | Start frontend dev server |

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRESQL_URL` | PostgreSQL connection URL | `postgres://user:pass@host:5432/db?sslmode=disable` |
| `PORT` | Server port | `8080` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `random_long_string` |
| `ADMIN_EMAIL` | Initial admin account email (for seeding) | `admin@example.com` |
| `ADMIN_PASSWORD` | Initial admin account password (for seeding) | `secure_password` |
| `ENABLE_SMTP` | Enable email functionality | `TRUE` or `FALSE` |
| `SMTP_HOST` | SMTP server hostname | `smtp.example.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username/sender email | `user@example.com` |
| `SMTP_PASSWORD` | SMTP password | `smtp_password` |
| `MAIL_TO` | Recipient for contact form | `contact@example.com` |
| `VITE_BACKEND_URL` | Backend API URL for frontend | `http://localhost:8080` |

## Database Migrations

This project uses Sequelize CLI for database migrations.

### Available Commands

Run these from the `webserver/` directory (or use Makefile commands):

```bash
# Run all pending migrations
npm run db:migrate

# Undo the last migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all

# Run all seeders
npm run db:seed

# Undo all seeders
npm run db:seed:undo

# Reset database (undo all, migrate, seed)
npm run db:reset
```

### Migration Files

Located in `webserver/db/migrations/`:

- `20241126000001-create-initial-schema.cjs` - Creates all tables and relationships

### Seeder Files

Located in `webserver/db/seeders/`:

1. `20241126000001-seed-groups.cjs` - Creates admin and public groups
2. `20241126000002-seed-organizations.cjs` - Creates public organization
3. `20241126000003-seed-meals.cjs` - Creates meal types (Desayuno, Almuerzo, Cena)
4. `20241126000004-seed-types.cjs` - Creates content types (Entrada, P. Fondo, Bebida, Postre, etc.)
5. `20241126000005-seed-admin-user.cjs` - Creates admin user from environment variables

### Creating New Migrations

```bash
cd webserver
npx sequelize-cli migration:generate --name add-new-feature
```

## API Routes

### Public
- `GET /` - Landing page
- `GET /menu/*` - React frontend (SPA)
- `POST /contact` - Contact form submission

### Users
- `POST /api/users/register` - User registration
- `POST /api/users/authenticate` - Login
- `GET /api/users/profile` - Get user profile (auth required)
- `GET /api/users/confirm/:token` - Email confirmation

### Menus
- Various CRUD operations under `/api/menus`

### Testimonials
- Survey/review endpoints under `/api/testimonials`

## Database Schema

### Tables

- **groups** - User roles (admin, public)
- **organizations** - Restaurant/business entities
- **users** - User accounts with bcrypt password hashing
- **meals** - Meal types (Desayuno, Almuerzo, Cena)
- **types** - Content categories (Entrada, P. Fondo, Bebida, Postre, etc.)
- **menus** - Daily menu entries
- **contents** - Food items
- **MenuContent** - Join table for menu-content many-to-many relationship
- **testimonials** - User reviews/ratings

### Relationships

```
Group (1) ─────< User (N)
Organization (1) ─────< User (N)
Organization (1) ─────< Menu (N)
Meal (1) ─────< Menu (N)
Type (1) ─────< Content (N)
Menu (N) >─────< Content (N)  [via MenuContent]
Menu (1) ─────< Testimonial (N)
```

## License

ISC
