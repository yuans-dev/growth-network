
---

# AUTH.md — Supabase Auth + RBAC (Roles + Permissions + authorize())

## Objective

Implement a **permission-based RBAC system** where:

* Roles map to permissions
* Permissions are enforced in **RLS**
* JWT contains role via **custom claims**
* App uses `authorize("permission")` at DB level
* Next.js uses role only for routing/UI

---

# 1. Core Architecture

### Flow

```
User → login → JWT issued
        ↓
Auth Hook injects role into JWT
        ↓
RLS uses authorize(permission)
        ↓
Next.js only reads role for UI/redirects
```

Key idea:

> Authorization happens in **Postgres**, not in your app.

---

# 2. Database Schema (MANDATORY)

## 2.1 ENUMS

```sql
create type public.app_role as enum (
  'member',
  'advisor',
  'staff',
  'admin'
);

create type public.app_permission as enum (
  'profiles.read',
  'profiles.update',
  'profiles.admin',
  'content.create',
  'content.delete'
);
```

---

## 2.2 USER ROLES

```sql
create table public.user_roles (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  role app_role not null,
  unique (user_id)
);
```

---

## 2.3 ROLE PERMISSIONS

```sql
create table public.role_permissions (
  id bigint generated always as identity primary key,
  role app_role not null,
  permission app_permission not null,
  unique (role, permission)
);
```

---

## 2.4 Seed Permissions

```sql
insert into public.role_permissions (role, permission) values
-- member
('member', 'profiles.read'),

-- advisor
('advisor', 'profiles.read'),

-- staff
('staff', 'profiles.read'),
('staff', 'profiles.update'),

-- admin
('admin', 'profiles.read'),
('admin', 'profiles.update'),
('admin', 'profiles.admin'),
('admin', 'content.create'),
('admin', 'content.delete');
```

---

# 3. Auth Hook (Inject Role into JWT)

Supabase allows modifying JWT **before issuance** using a hook ([Supabase][2])

## 3.1 Function

```sql
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role public.app_role;
begin
  select role into user_role
  from public.user_roles
  where user_id = (event->>'user_id')::uuid;

  claims := event->'claims';

  claims := jsonb_set(
    claims,
    '{user_role}',
    to_jsonb(user_role)
  );

  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$$;
```

---

## 3.2 Permissions

```sql
grant usage on schema public to supabase_auth_admin;

grant execute
on function public.custom_access_token_hook
to supabase_auth_admin;

revoke execute
on function public.custom_access_token_hook
from anon, authenticated, public;
```

---

## 3.3 Enable Hook

Dashboard:

```
Auth → Hooks → Custom Access Token Hook → select function
```

---

# 4. authorize(permission) Function

This is the **core of your system**.

Supabase explicitly recommends this pattern ([Supabase][1])

```sql
create or replace function public.authorize(
  requested_permission public.app_permission
)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  user_role public.app_role;
  has_permission int;
begin
  -- Read role from JWT
  select (auth.jwt() ->> 'user_role')::public.app_role
  into user_role;

  -- Check permission
  select count(*)
  into has_permission
  from public.role_permissions
  where role = user_role
    and permission = requested_permission;

  return has_permission > 0;
end;
$$;
```

---

# 5. RLS (REAL SECURITY LAYER)

## Enable

```sql
alter table public.profiles enable row level security;
```

---

## Example Policies

### Read

```sql
create policy "profiles read"
on public.profiles
for select
to authenticated
using (
  authorize('profiles.read')
);
```

---

### Update

```sql
create policy "profiles update"
on public.profiles
for update
to authenticated
using (
  authorize('profiles.update')
);
```

---

### Admin

```sql
create policy "profiles admin"
on public.profiles
for all
to authenticated
using (
  authorize('profiles.admin')
);
```

---

# 6. Auto-Assign Role on Signup

```sql
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'member');
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```

---

# 7. Next.js Integration

## 7.1 Read Role (Server)

```ts
import { createClient } from '@/lib/supabase/server'

export async function getUserRole() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // role is inside JWT
  const { data: session } = await supabase.auth.getSession()

  return session?.session?.user?.user_metadata?.user_role
}
```

⚠️ Note:
JWT contains role, no DB query needed

---

## 7.2 Middleware (Routing Only)

```ts
if (!user && isProtected) redirect('/login')

if (user && isAdminRoute) {
  const role = jwt.user_role
  if (role !== 'admin') redirect('/unauthorized')
}
```

---

## 7.3 Important Rule

Never do:

```ts
if (!authorize(...)) // ❌ invalid
```

Because:

* `authorize()` exists ONLY in Postgres
* Security lives in RLS

---

# 8. How Authorization Works End-to-End

### Example: Delete Content

1. User calls API
2. Supabase checks RLS
3. RLS calls:

```sql
authorize('content.delete')
```

4. Permission checked via:

```
JWT → role → role_permissions → allow/deny
```

---

# 9. Why This Architecture Works

### Advantages

* Zero trust client
* No repeated DB joins (JWT contains role)
* Centralized permission logic
* Scales cleanly

### Tradeoff

* Role updates require token refresh

---

# 10. Required Git Workflow

Every RBAC change:

```bash
npx supabase migration new add_permissions
npx supabase db push

git add .
git commit -m "feat: RBAC permissions system"
git push
```

---

# 11. Testing Matrix

| Role    | profiles.read | profiles.update | profiles.admin |
| ------- | ------------- | --------------- | -------------- |
| member  | ✓             | ✗               | ✗              |
| advisor | ✓             | ✗               | ✗              |
| staff   | ✓             | ✓               | ✗              |
| admin   | ✓             | ✓               | ✓              |

---

# 12. Extension Path (Next Level)

* Multiple roles per user
* Organization-based RBAC
* Permission caching in JWT (advanced)
* Feature flags via permissions

---

# Key Insight

You now have:

```
authorize("permission")  ← SINGLE SOURCE OF TRUTH
```

Everything (API, UI, DB) flows from that.

---
