# CVify AI — Accounts setup (Supabase)

This is needed before I can build **sign in / Google login / dashboard / saved CVs** and
require sign-in for the builder. It's free. Do these steps, then send me the **Project URL**
and **anon key** (the anon key is safe to share — it's a public key).

## 1. Create a free Supabase project

1. Go to <https://supabase.com> → sign in (you can use GitHub/Google).
2. Click **New project**. Pick a name (e.g. `cvify-ai`), set a database password (save it), choose a region near you.
3. Wait ~2 minutes for it to provision.

## 2. Get your keys

1. In the project: **Project Settings** (gear) → **API**.
2. Copy:
   - **Project URL** → looks like `https://xxxxxxxx.supabase.co`
   - **anon public** key → a long string starting with `eyJ...`
3. Send both to me. (The anon key is public-safe; the service-role key must stay secret — don't send that one.)

## 3. Enable Google sign-in

1. **Authentication** → **Providers** → **Google** → enable.
2. It needs a Google OAuth Client ID + Secret:
   - Go to <https://console.cloud.google.com/> → create/select a project.
   - **APIs & Services → Credentials → Create Credentials → OAuth client ID** → type **Web application**.
   - Authorized redirect URI: paste the **callback URL** that Supabase shows on the Google provider page
     (looks like `https://xxxxxxxx.supabase.co/auth/v1/callback`).
   - Copy the **Client ID** and **Client secret** back into Supabase's Google provider, save.
3. (Email sign-up works out of the box — no extra setup.)

## 4. Create the database tables

Open **SQL Editor** → **New query**, paste this, and **Run**:

```sql
-- User profiles
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

-- Saved CVs
create table public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text default 'Untitled CV',
  data jsonb not null,
  template text default 'aurora',
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Security: users can only see/edit their own rows
alter table public.profiles enable row level security;
alter table public.cvs enable row level security;

create policy "Own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Own cvs" on public.cvs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row when someone signs up
create function public.handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## 5. What I'll do once you send the keys

I'll set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (locally + on Vercel), then build:

- `/login` and `/signup` pages (email + **Continue with Google**)
- Require sign-in to open `/build*` (redirect to `/login` if signed out)
- A **Dashboard** (`/dashboard`): your saved CVs (open / rename / delete) + manage profile
- **Save** button in the editor that stores the CV to your account
- Header shows your avatar/menu when signed in

Until then, everything else (builder, templates, AI, PDF) keeps working without an account.
