# AI Live Chat Project

This repository contains both a React frontend (using Vite and TanStack Start) and an Express.js backend.

## Backend Setup Instructions

The backend requires a PostgreSQL database and an Express server to be running. Follow these steps to spin up the local development environment.

### 1. Start the PostgreSQL Database

A `docker-compose.yml` file is provided at the root of the project to quickly start a local PostgreSQL instance.

```bash
# In the root directory, start the DB
docker-compose up -d
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
touch .env
```

Add the following variables to `backend/.env` and replace `<YOUR_GEMINI_API_KEY>` with your actual Gemini API key:

```env
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/aichat?schema=public"
GEMINI_API_KEY="<YOUR_GEMINI_API_KEY>"
PORT=3001
```

### 3. Install Dependencies

Install the necessary backend dependencies:

```bash
# Inside the backend/ directory
npm install
```

### 4. Setup Prisma and the Database

Push the schema to the database and generate the Prisma Client:

```bash
# Inside the backend/ directory
npx prisma db push
npx prisma generate
```

*(Optional)* You can seed the database to test your connection:

```bash
npm run db:seed
```

### 5. Start the Development Server

Start the Express backend on `http://localhost:3001`:

```bash
# Inside the backend/ directory
npm run dev
```

The server will be running with automatic restart enabled via `tsx`.
