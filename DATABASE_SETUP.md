# Database Setup for Production

## Current Issue

Your application is configured to use SQLite with a local file (`file:./dev.db`), which doesn't work in Vercel's serverless environment.

## Solutions

### Option 1: Turso (SQLite Cloud) - Recommended

1. Sign up at [turso.tech](https://turso.tech/)
2. Create a new database
3. Get your database URL and token
4. Update Vercel environment variables:
   ```
   DATABASE_URL=libsql://your-db-name.turso.io
   DATABASE_AUTH_TOKEN=your-auth-token
   ```
5. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

### Option 2: PlanetScale (MySQL)

1. Sign up at [planetscale.com](https://planetscale.com/)
2. Create a new database
3. Get connection string
4. Update environment variables and schema

### Option 3: Supabase (PostgreSQL)

1. Sign up at [supabase.com](https://supabase.com/)
2. Create a new project
3. Get PostgreSQL connection string
4. Update schema provider to "postgresql"

## Current Fallback

The app now uses mock data when DATABASE_URL is missing, so it won't crash in production.

## Environment Variables Needed in Vercel

- `DATABASE_URL`
- `GOOGLE_ID`
- `GOOGLE_SECRET`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
