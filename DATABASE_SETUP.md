# Database Setup (MongoDB + Prisma)

This project is configured for MongoDB. Prisma is set to `provider = "mongodb"` and a mock Prisma client is used when `DATABASE_URL` is not provided (for previews). For production, configure a real MongoDB database.

Relevant files:

- `prisma/schema.prisma` → `provider = "mongodb"`
- `prisma/migrations/migration_lock.toml` → `provider = "mongodb"`
- `src/db/db.ts` → Mock Prisma fallback when `DATABASE_URL` is missing

## Option A: MongoDB Atlas (recommended)

1. Create a free cluster at https://www.mongodb.com/atlas
2. Create a Database User (SCRAM) with username/password.
3. Network Access: Allow your IP (or 0.0.0.0/0 for testing).
4. Get the connection string: “Connect your application” → Driver Node.js.
5. IMPORTANT: Include a database name in the URI.

Example `DATABASE_URL` (SRV):

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/kingtech?retryWrites=true&w=majority
```

Notes:

- Replace `USERNAME`/`PASSWORD` and ensure special characters are URL-encoded.
- Replace `kingtech` with your desired DB name.

## Option B: Local MongoDB (developer machine)

- Install MongoDB Community or run via Docker:

```cmd
docker run -d --name mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_PASSWORD=pass mongo:6
```

Connection URL (local):

```
mongodb://user:pass@localhost:27017/kingtech?authSource=admin
```

## Environment Variable

Set in `.env.local` (dev) and Vercel (prod):

```
DATABASE_URL=... # Must start with mongodb or mongodb+srv and include a DB name
```

If `DATABASE_URL` is not set, the app will use a mock DB client to keep non‑DB pages working. For production, always set a real `DATABASE_URL`.

## Prisma Commands

- Generate client (build does this automatically):

```cmd
npx prisma generate
```

- Push schema changes to your MongoDB database (development):

```cmd
npx prisma db push
```

Notes:

- Prisma Migrate is not supported for MongoDB; prefer `db push` instead of migrations.
- Do not apply SQL migrations from older setups; this project already targets MongoDB.

## Common Issues & Fixes

- Error: “URL must start with mongo…”
  - Use a Mongo URL starting with `mongodb://` or `mongodb+srv://` and include a database name.
- Authentication failed
  - Verify username/password and ensure they are URL-encoded in the URI.
- Connection timeouts
  - Add your server IP to Atlas Network Access or temporarily allow 0.0.0.0/0 (testing only).
- ObjectId errors
  - Ensure routes receive valid Mongo ObjectIds; the app includes guards, but invalid IDs will be rejected.

## After Setup

1. Add `DATABASE_URL` to Vercel Project → Settings → Environment Variables.
2. Redeploy. The build runs `prisma generate` then `next build`.
3. Visit the app; admin pages will use the live database.
