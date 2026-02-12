-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- create months table
create table months (
  id text primary key,
  name text not null,
  status text check (status in ('active', 'closed', 'upcoming')) default 'upcoming',
  description text,
  images text[] default '{}'::text[],
  created_at timestamptz default now()
);

-- create reviews table
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  month_id text references months(id),
  nickname text,
  rating int check (rating >= 0 and rating <= 5),
  specifics jsonb default '{"taste": 0, "portion": 0, "presentation": 0}'::jsonb,
  love text,
  improve text,
  images text[] default '{}'::text[],
  timestamp timestamptz default now(),
  is_featured boolean default false
);

-- Enable RLS
alter table months enable row level security;
alter table reviews enable row level security;

-- Policies (OPEN for Public Access - Note: For MVP only)
-- Ideally, limit write access to authenticated users later
create policy "Public Read Months" on months for select using (true);
create policy "Public Write Months" on months for all using (true);

create policy "Public Read Reviews" on reviews for select using (true);
create policy "Public Write Reviews" on reviews for insert with check (true);
create policy "Public Update Reviews" on reviews for update using (true); -- needed for featuring reviews

-- Storage Bucket for Images
insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Storage Policies
create policy "Public Access Images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Public Upload Images" on storage.objects for insert with check ( bucket_id = 'images' );
