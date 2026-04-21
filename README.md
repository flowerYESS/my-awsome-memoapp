# my-awsome-memoapp

Next.js memo app with authentication and Prisma.

## Deploy with GitHub + Vercel + Neon

1. Create a Neon PostgreSQL database and copy its connection string.
2. In Vercel, import this GitHub repository.
3. Add environment variables in Vercel project settings:
   - `DATABASE_URL` (Neon connection string)
   - `AUTH_SECRET` (long random secret)
4. Set Build Command to:
   - `npx prisma migrate deploy && next build`
5. Deploy.

## Local development

1. Copy `.env.example` to `.env` and fill values.
2. Run:
   - `npx prisma migrate dev`
   - `npm run dev`
