# Coreflow BE

REST API backend for the Coreflow ERP system. Built with Node.js, Express, PostgreSQL, and Prisma.

## Stack

Node.js · TypeScript · Express · PostgreSQL · Prisma 6 · JWT · bcrypt · Docker

## Setup

```bash
npm install
cp .env.example .env   # fill in variable values
docker compose up -d db
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Server runs at `http://localhost:4000/api`.

Default admin after seeding: `admin@coreflow.com` / `admin123`

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Dev server with hot reload |
| `npm run build` | Compile to `dist/`         |
| `npm start`     | Run production build       |
