# The Growth Network Matching Platform

AI-powered matching and deal facilitation platform for Exoasia Innovation Hub.

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm, pnpm, or yarn
- Supabase CLI (for local dev)

## Setup

1) Install dependencies

```bash
npm install
```

2) Install Supabase CLI

Use any of the supported install methods from Supabase. Example using npm:

```bash
npm install -g supabase
```

Verify:

```bash
supabase --version
```

3) Create `.env.local`

Create a `.env.local` in the project root with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Where to get values:

- Local dev: run `supabase start` and use the local API URL and anon/service keys from the CLI output.
- Remote dev: use your Supabase project settings.

4) Start Supabase locally (optional but recommended for local dev)

```bash
supabase start
```

5) Run the web app

```bash
npm run dev
```

Open http://localhost:3000.

## Useful Commands

```bash
supabase start
supabase stop
supabase status
```

## Notes

- The app is built with Next.js App Router.
- Keep `.env.local` out of version control.
