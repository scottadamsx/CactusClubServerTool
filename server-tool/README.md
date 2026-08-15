# Cactus Club Server Tool

A Next.js app used by servers to manage menu items and generate AI-powered menu recommendations based on order history.

## Live URL

Set this after deploy:

`https://your-domain.vercel.app`

## Tech Stack

- Next.js 16 (App Router)
- React 19
- MongoDB Atlas
- Vercel AI SDK + Groq provider

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create local env file:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local` values.

4. Run the app:

```bash
npm run dev
```

## Required Environment Variables

See `.env.example` for the full list.

- `MONGODB_URI` - MongoDB connection string
- `GROQ_API_KEY` - Groq API key for AI recommendations
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `NEXTAUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - App URL for NextAuth in production
- `AUTH_URL` - Optional alias for auth URL depending on auth setup

## Production Deploy (Vercel)

1. Push your branch to GitHub.
2. Import this repo in Vercel.
3. Add environment variables from `.env.example`, including `GROQ_API_KEY`.
4. Deploy and copy the production domain.
5. Set `NEXTAUTH_URL` (or `AUTH_URL`) in Vercel to the production domain.
6. Redeploy after env updates.

## Google OAuth Checklist

In Google Cloud Console for your OAuth client:

- Authorized JavaScript origins:
	- `https://your-domain.vercel.app`
	- keep localhost origins for local development
- Authorized redirect URIs:
	- `https://your-domain.vercel.app/api/auth/callback/google`
	- keep localhost callback URI for local development

## MongoDB Atlas Checklist

Allow your deployed app to connect from Vercel. A common serverless option is:

- Network Access: `0.0.0.0/0`

Use this only if needed for your deployment and lock down with credentials and least privilege.
