# Northcoders News API

![NC News Logo](public/logo.ico)

## Hosted Version

The live API can be accessed at **https://jeff-nc-news.onrender.com/** .

## Project Summary

This repository contains the backend portion of the **NC News** project. It's a RESTful API built with **Node.js**, **Express**, and **node-postgres** that provides programmatic access to a seeded PostgreSQL database. The API exposes endpoints for topics, articles, comments, and users—mimicking the functionality of a real‑world news aggregation service.

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

Each file must contain the following variables:

```env
PGHOST=localhost
PGUSER=<your_pg_user>
PGPASSWORD=<your_pg_password>
PGDATABASE=<appropriate_database_name>
PGPORT=5432
```

For the development file use `nc_news` and for the test file use `nc_news_test`.

> These files are gitignored and should **never** be committed.

### 5. Seed the databases

The repository already includes seeding scripts. Run:

```bash
npm run seed
```

This will populate both the development and test databases with the sample data used throughout the project.

### 6. Run the server

```bash
npm start          # starts the API on port 9090 by default
npm run dev        # start with nodemon for development
```

### 7. Run tests

```bash
npm test
```

All Jest/Supertest suites are located under the `__tests__` directory and exercise the core endpoints.

## Core API Endpoints

| Method | Path                                 | Description                              |
| ------ | ------------------------------------ | ---------------------------------------- |
| GET    | `/api/topics`                        | List all topics                          |
| GET    | `/api/articles`                      | List articles (with filtering & sorting) |
| GET    | `/api/articles/:article_id`          | Retrieve a single article                |
| GET    | `/api/articles/:article_id/comments` | Comments for an article                  |
| POST   | `/api/articles/:article_id/comments` | Add a comment to an article              |
| PATCH  | `/api/articles/:article_id`          | Update an article's votes/title          |
| DELETE | `/api/comments/:comment_id`          | Remove a comment                         |
| GET    | `/api/users`                         | List all users                           |
| GET    | `/api/users/:username`               | Retrieve a single user                   |

> See the static documentation at `public/index.html` when the server is running.

## Requirements

- **Node.js**: version **16.x** or later
- **PostgreSQL**: version **14.x** or later

## Testing

This project uses **Jest** and **Supertest**. Tests are configured to run against the `nc_news_test` database. Make sure to seed the test database before running the suite.

## Project Structure

```
src/
  controllers/      # Express route handlers
  services/         # Business logic and database queries
  models/           # SQL query helpers
  routes/           # Router definitions
  errors/           # Custom error classes and handlers
  app.js            # Express app setup

__tests__/          # Jest test files mirroring src structure
public/             # Static documentation & client HTML
db/                 # Connection and seeding scripts
```

## Author

- **Jeff Sun** – [GitHub](https://github.com/JeffSun93)

## Notes

- Do **not** push your `.env` files.
- Ensure the databases are seeded before testing or running the server.

---
