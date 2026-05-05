-- RBAC: roles, permissions, JWT hook, and RLS policies

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'app_role' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.app_role AS ENUM (
      'member',
      'advisor',
      'staff',
      'admin'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'app_permission' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.app_permission AS ENUM (
      'profiles.read',
      'profiles.update',
      'profiles.admin',
      'content.create',
      'content.delete'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role public.app_role NOT NULL,
  permission public.app_permission NOT NULL,
  UNIQUE (role, permission)
);

INSERT INTO public.role_permissions (role, permission) VALUES
  ('member', 'profiles.read'),
  ('advisor', 'profiles.read'),
  ('staff', 'profiles.read'),
  ('staff', 'profiles.update'),
  ('admin', 'profiles.read'),
  ('admin', 'profiles.update'),
  ('admin', 'profiles.admin'),
  ('admin', 'content.create'),
  ('admin', 'content.delete')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claims jsonb;
  user_role public.app_role;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = (event->>'user_id')::uuid;

  claims := event->'claims';

  claims := jsonb_set(
    claims,
    '{user_role}',
    to_jsonb(user_role)
  );

  event := jsonb_set(event, '{claims}', claims);

  RETURN event;
END;
$$;

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

GRANT EXECUTE
ON FUNCTION public.custom_access_token_hook
TO supabase_auth_admin;

REVOKE EXECUTE
ON FUNCTION public.custom_access_token_hook
FROM anon, authenticated, public;

CREATE OR REPLACE FUNCTION public.authorize(
  requested_permission public.app_permission
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role public.app_role;
  has_permission int;
BEGIN
  SELECT (auth.jwt() ->> 'user_role')::public.app_role
  INTO user_role;

  SELECT count(*)
  INTO has_permission
  FROM public.role_permissions
  WHERE role = user_role
    AND permission = requested_permission;

  RETURN has_permission > 0;
END;
$$;

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "profiles read" ON public.profiles;
    CREATE POLICY "profiles read"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (authorize('profiles.read'));

    DROP POLICY IF EXISTS "profiles update" ON public.profiles;
    CREATE POLICY "profiles update"
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (authorize('profiles.update'));

    DROP POLICY IF EXISTS "profiles admin" ON public.profiles;
    CREATE POLICY "profiles admin"
      ON public.profiles
      FOR ALL
      TO authenticated
      USING (authorize('profiles.admin'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'member')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
