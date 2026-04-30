-- ===== DEVOPS ACADEMY — SUPABASE SETUP =====
-- Run this entire file in your Supabase project:
-- supabase.com → your project → SQL Editor → New query → paste → Run

-- 1. Progress table (tracks completed lessons)
create table if not exists public.progress (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  lesson_id    text not null,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- 2. Quiz scores table
create table if not exists public.quiz_scores (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  quiz_id    text not null,
  score      int not null,
  total      int not null,
  percentage int not null,
  taken_at   timestamptz default now()
);

-- 3. Terminal history table
create table if not exists public.terminal_history (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  module      text not null,
  command     text not null,
  executed_at timestamptz default now()
);

-- 4. Row Level Security (users can only see/edit their own data)
alter table public.progress         enable row level security;
alter table public.quiz_scores      enable row level security;
alter table public.terminal_history enable row level security;

create policy "own_progress"         on public.progress         for all using (auth.uid() = user_id);
create policy "own_quiz_scores"      on public.quiz_scores      for all using (auth.uid() = user_id);
create policy "own_terminal_history" on public.terminal_history for all using (auth.uid() = user_id);
