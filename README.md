# Gaff.ie — Irish Property Platform

Next.js 16 (App Router) · Prisma 5 · PostgreSQL · TypeScript · Tailwind CSS 4

## Quick Start (Local Dev)

```bash
cp .env.example .env   # edit with your DB credentials
npm install
npx prisma generate
npx prisma db push
npm run dev             # http://localhost:3000
```

## Docker Build

```bash
docker build -t gaff .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgres://gaff:pass@host:5432/gaff" \
  -e JWT_SECRET="secret" \
  gaff
```

## Architecture

```
src/app/
  ├── api/          # API routes (auth, properties, etc.)
  ├── layout.tsx    # Root layout
  └── page.tsx      # Homepage
prisma/
  ├── schema.prisma # Database schema
  └── seed.ts       # Seed data
```

## Deployment (Coolify)

1. Push to Git repo connected to Coolify
2. Coolify builds using the Dockerfile
3. Set environment variables in Coolify dashboard:
   - `DATABASE_URL` — internal Docker network PostgreSQL URL
   - `JWT_SECRET` — random secure string
4. PostgreSQL runs as a separate Coolify resource on the same network
5. App connects via internal hostname: `i8w0kgso88g84ccgc4kgoc8o:5432`

## Database

```bash
npx prisma db push      # apply schema
npx prisma db seed      # seed data
npx prisma studio       # GUI browser
```
