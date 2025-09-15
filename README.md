## KingTech – Next.js E‑commerce (App Router)

Production-ready, full-stack e‑commerce foundation built on Next.js 14 (App Router), Prisma (MongoDB), NextAuth (Google OAuth), and Cloudinary for media. Includes an admin dashboard, secure digital downloads, and modern UI with Tailwind.

## Features

- Admin dashboard: manage products, availability, pricing, and assets.
- Auth: Google OAuth via NextAuth with admin allowlist (`ADMIN_EMAILS`).
- Optional Basic Auth for `/admin/*` via middleware (toggle with env).
- Media: Cloudinary image optimization and raw file storage for downloads.
- Secure downloads: redirect to Cloudinary signed asset URLs.
- Database: Prisma with MongoDB provider and a mock fallback if `DATABASE_URL` is missing (keeps previews working).
- Performance: Next/Image remote patterns, request caching, and Vercel Speed Insights.
- Resilience: Root error boundary surfaces error `digest` for troubleshooting.
- Polished UI: Responsive layouts, branded nav & footer with logo, pointer-follow highlight.

## Tech Stack

- Next.js 14 App Router, TypeScript, Server Actions
- Tailwind CSS, shadcn/ui primitives
- Prisma ORM (MongoDB), mock Prisma client fallback
- NextAuth (Google provider)
- Cloudinary (images + raw files)
- Vercel Speed Insights

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Create `.env.local` with the required variables (see below).

3. Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables

Copy this into `.env.local` and fill with your values:

```bash
# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32+char-random-string

# Google OAuth (Admin sign-in)
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx
# Optional legacy names used in code as fallback
GOOGLE_ID=
GOOGLE_SECRET=

# Admin allowlist (comma-separated emails)
ADMIN_EMAILS=owner@example.com,admin@example.com

# MongoDB (Prisma) – must start with mongodb or mongodb+srv
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/kingtech?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Optional Basic Auth for /admin (set true to enable)
ADMIN_BASICAUTH=false
ADMIN_USERNAME=admin
HASHED_ADMIN_PASSWORD=$2b$12$...   # bcrypt hash
```

Notes:

- In production, set `NEXTAUTH_URL` to your exact domain (e.g., https://your-domain.com).
- Add the production callback URL to your Google OAuth client: `https://your-domain.com/api/auth/callback/google`.

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build (runs `prisma generate` then Next build)
- `npm run start` – Start production server
- `npm run lint` – Lint codebase

## Development Notes

- Prisma: Client is generated during `build`. If you change `prisma/schema.prisma`, run:

```bash
npx prisma generate
```

- Images: Next/Image allows Cloudinary (`res.cloudinary.com`) and Unsplash by config.
- Server Actions: request body size limited to 4mb in `next.config.mjs`.
- Stripe: Payment system and webhooks are currently disabled (stub route returns 200).

## Authentication & Admin Access

- Sign in with Google at `/login`. Only emails in `ADMIN_EMAILS` are granted admin access.
- Optional Basic Auth for `/admin/*` is controlled by `ADMIN_BASICAUTH`. When `true`, requests must include valid `ADMIN_USERNAME` and `HASHED_ADMIN_PASSWORD` (bcrypt) credentials.

## Media & Downloads

- Product images and files are uploaded to Cloudinary. Images use `resource_type: image`; downloadable files use `resource_type: raw`.
- The admin download route issues redirects to Cloudinary for secure delivery and proper filenames.

## Error Handling & Observability

- A root error boundary captures server errors and displays a friendly message plus the `error.digest` to aid debugging.
- Vercel Speed Insights is installed and rendered in the root layout.

## Deploy

1. Set environment variables in your hosting platform (Vercel recommended): - `NEXTAUTH_URL`, `NEXTAUTH_SECRET` - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (and/or `GOOGLE_ID`, `GOOGLE_SECRET`) - `ADMIN_EMAILS` - `DATABASE_URL` (MongoDB with database name) - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Optional: `ADMIN_BASICAUTH`, `ADMIN_USERNAME`, `HASHED_ADMIN_PASSWORD`
2. Configure Google OAuth redirect URIs for your production domain.
3. Deploy. The build runs `prisma generate` and then `next build`.

If `DATABASE_URL` is not set, the app falls back to a mock Prisma client to keep non‑DB pages and previews working.

## License

MIT
