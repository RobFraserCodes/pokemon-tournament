# Pokemon TCG Tournament Registration App

A colourful Next.js app for registering children for a friendly local Pokemon TCG tournament.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui source components
- Supabase database writes through server actions
- Zod and React Hook Form validation

## Project Structure

```txt
src/
  app/
    actions/register-entry.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    landing/
      event-info.tsx
      faq-section.tsx
      hero-section.tsx
      success-message.tsx
      tournament-signup-form.tsx
    ui/
  lib/
    supabase/server.ts
    validation/tournament-entry.ts
    utils.ts
  types/database.ts
supabase/
  migrations/001_create_tournament_entries.sql
```

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase Setup

Run the SQL in `supabase/migrations/001_create_tournament_entries.sql` against your Supabase project. It creates:

- `public.tournament_entries`
- UUID primary key and `created_at`
- age and experience-level checks
- indexes for registration review
- RLS with public insert access for the MVP registration form

Future tournament management features should add separate tables for tournaments, player profiles, rounds, matches, standings, and admin users rather than expanding the MVP registration table into every role.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Notes

- Configure the same Supabase environment variables in your hosting provider.
- Keep RLS enabled in Supabase.
- Add an admin-only read policy or service-role backed admin route when the future admin dashboard is implemented.
- Regenerate `src/types/database.ts` from Supabase once more tables are added.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
