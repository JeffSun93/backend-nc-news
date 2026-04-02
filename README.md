# Northcoders News API

![NC News Logo](public/logo.ico)

## Hosted Version

The live API can be accessed at **https://jeff-nc-news.onrender.com/**.

## Project Summary

This repository contains the backend portion of the **NC News** project. It's a RESTful API built with **Node.js**, **Express**, and **node-postgres** that provides programmatic access to a seeded PostgreSQL database. The API exposes endpoints for topics, articles, comments, and users—mimicking the functionality of a real-world news aggregation service.

A simple static front end (found under `public/`) provides documentation of the available routes.

## Getting Started

Follow the steps below to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/JeffSun93/backend-nc-news.git
cd nc-news-BE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the databases

Make sure PostgreSQL (>= 14) is installed and running on your machine. Create the two databases:

```bash
createdb nc_news
createdb nc_news_test
```

### 4. Create `.env` files

Create two files in the project root at the same level as `package.json`:

- `.env.development`
- `.env.test`

Each file only needs one variable:

`.env.development`:

```env
PGDATABASE=nc_news
```

`.env.test`:

```env
PGDATABASE=nc_news_test
```

If your PostgreSQL setup requires a password or non-default user, you may also add `PGUSER` and `PGPASSWORD`.

> These files are gitignored and should **never** be committed.

### 5. Seed the database

```bash
npm run seed
```

This seeds the **development** database using `.env.development`.

> The test database is automatically re-seeded by Jest before each test run — no manual step needed.

### 6. Run the server

```bash
npm start          # starts the API on port 9090 by default
npm run dev-start  # start with nodemon for development
```

### 7. Run tests

```bash
npm test
```

All Jest/Supertest suites are located under the `__tests__` directory and exercise the core endpoints.

## Core API Endpoints

| Method | Path                                 | Description                 |
| ------ | ------------------------------------ | --------------------------- |
| GET    | `/api/topics`                        | List all topics             |
| GET    | `/api/articles`                      | List articles (filterable)  |
| GET    | `/api/articles/:article_id`          | Retrieve a single article   |
| GET    | `/api/articles/:article_id/comments` | Comments for an article     |
| POST   | `/api/articles/:article_id/comments` | Add a comment to an article |
| PATCH  | `/api/articles/:article_id`          | Update an article's votes   |
| DELETE | `/api/comments/:comment_id`          | Remove a comment            |
| PATCH  | `/api/comments/:comment_id`          | Update a comment's votes    |
| GET    | `/api/users`                         | List all users              |
| GET    | `/api/users/:username`               | Retrieve a single user      |

**`GET /api/articles` query parameters:**

- `topic` — filter by topic slug (default: all topics)
- `sort_by` — `author`, `title`, `article_id`, `topic`, `created_at`, `votes`, `comment_count` (default: `created_at`)
- `order` — `ASC` or `DESC` uppercase (default: `DESC`)

> See the static documentation at `public/index.html` when the server is running.

## Requirements

- **Node.js**: version **16.x** or later
- **PostgreSQL**: version **14.x** or later

## Architecture

This project follows an **MVC-inspired layered architecture**:

- **Routes** — define URL patterns and delegate to controllers
- **Controllers** — parse the request and send the response
- **Services** — validate inputs and contain business logic
- **Models** — execute parameterized SQL queries against the database

This separation keeps each layer focused and independently testable.

## Testing

This project uses **Jest** and **Supertest**. Tests run against the `nc_news_test` database.
Jest automatically re-seeds the test database before each run — just ensure the database exists (see step 3).

The test suite covers two levels:

- **Unit tests** — controllers, services, models, and utilities are tested in isolation
- **Integration tests** — full request/response cycle tested against a live test database for each endpoint

A **Husky** pre-commit hook is configured to run `npm test` automatically before every commit. If any test fails, the commit will be blocked.

## Project Structure

```text
src/
  controllers/      # Express route handlers
  services/         # Business logic and database queries
  models/           # SQL query helpers
  routes/           # Router definitions
  errors/           # Custom error classes and handlers
  constants/        # Shared constants
  utils/            # Utility helpers
  app.js            # Express app setup

__tests__/          # Unit and integration tests
public/             # Static documentation & client HTML
db/                 # Connection and seeding scripts
```

## Author

- **Jeff Sun** – [GitHub](https://github.com/JeffSun93)

---
