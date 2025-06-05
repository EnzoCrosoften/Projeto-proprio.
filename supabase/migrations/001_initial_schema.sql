
-- Enable RLS (Row Level Security)
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create users profile table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  username text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create phone numbers table
create table public.phone_numbers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  number text not null,
  is_active boolean default true not null,
  clicks_count integer default 0 not null,
  order_position integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create clicks table for analytics
create table public.clicks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  phone_number_id uuid references public.phone_numbers(id) on delete cascade not null,
  phone_number text not null,
  ip_address inet,
  user_agent text,
  country text,
  city text,
  state text,
  clicked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.phone_numbers enable row level security;
alter table public.clicks enable row level security;

-- Create RLS policies for users table
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- Create RLS policies for phone_numbers table
create policy "Users can view own phone numbers" on public.phone_numbers
  for select using (auth.uid() = user_id);

create policy "Users can insert own phone numbers" on public.phone_numbers
  for insert with check (auth.uid() = user_id);

create policy "Users can update own phone numbers" on public.phone_numbers
  for update using (auth.uid() = user_id);

create policy "Users can delete own phone numbers" on public.phone_numbers
  for delete using (auth.uid() = user_id);

-- Create RLS policies for clicks table
create policy "Users can view own clicks" on public.clicks
  for select using (auth.uid() = user_id);

create policy "Public can insert clicks" on public.clicks
  for insert with check (true);

-- Create indexes for better performance
create index idx_phone_numbers_user_id on public.phone_numbers(user_id);
create index idx_phone_numbers_active on public.phone_numbers(user_id, is_active);
create index idx_clicks_user_id on public.clicks(user_id);
create index idx_clicks_phone_number_id on public.clicks(phone_number_id);
create index idx_clicks_clicked_at on public.clicks(clicked_at desc);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_users_updated_at before update on public.users
  for each row execute function update_updated_at_column();

create trigger update_phone_numbers_updated_at before update on public.phone_numbers
  for each row execute function update_updated_at_column();

-- Create function to handle user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, username)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create function to get next phone number for rotation
create or replace function public.get_next_phone_number(user_username text)
returns text as $$
declare
  phone_record record;
  next_phone text;
begin
  -- Get user ID from username
  select id into phone_record from public.users where username = user_username;
  
  if phone_record is null then
    return null;
  end if;
  
  -- Get the next active phone number in rotation
  select number into next_phone
  from public.phone_numbers
  where user_id = phone_record.id 
    and is_active = true
  order by order_position
  limit 1;
  
  return next_phone;
end;
$$ language plpgsql security definer;
