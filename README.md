# NC News Seeding

## Environment Variables Setup

To run this project locally, you need to create environment variable files for both the development and test databases.

### 1. Create the following files in the root directory of the project:

.env.development
.env.test

These files should be created at the same level as `package.json`.

---

### 2. Add the following variables to each file:

Both files must contain the following PostgreSQL connection variables:

- `PGHOST` – the database host (usually `localhost`)
- `PGUSER` – your PostgreSQL username
- `PGPASSWORD` – your PostgreSQL password
- `PGDATABASE` – the name of the database
- `PGPORT` – the PostgreSQL port (usually `5432`)

---

### Example: `.env.development`

```env.development
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_password_here
PGDATABASE=bookshop_dev
PGPORT=5432
```

### Example: `.env.test`

```env.test
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_password_here
PGDATABASE=bookshop_test
PGPORT=5432
```

---

### 3. Notes

The development and test databases must already exist locally.

These .env files are not included in version control and should not be committed to Git.

The application will automatically load the correct .env file based on the environment when connecting to the database.

Once these files are set up, you will be able to connect to both the development and test databases locally.
