# M5VF Private Sale Platform

This repo contains a full-stack token sale portal for the M5VF private sale.

## Structure
- `m5sale-ui`: React + Vite frontend
- `m5sale-api`: Node/Express API with PostgreSQL

## Frontend setup
```bash
cd m5sale-ui
npm install
npm run dev
```

## Backend setup
```bash
cd m5sale-api
npm install
cp .env.example .env
# update DATABASE_URL to your Postgres instance
npm run db:setup
npm run dev
```

The UI expects the API at `http://localhost:4000` by default. You can override this with `VITE_API_URL`.
