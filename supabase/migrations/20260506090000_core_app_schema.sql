-- Core app schema for Growth Network matching platform
-- Includes RBAC foundations from AUTH.md plus platform tables and RLS policies.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'app_role' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.app_role AS ENUM ('member', 'advisor', 'staff', 'admin');
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

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'member_stage' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.member_stage AS ENUM ('0', '1', '2', '3', '4');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'verification_status' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.verification_status AS ENUM ('unverified', 'pending', 'verified');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'ask_offer_kind' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.ask_offer_kind AS ENUM ('ask', 'offer');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'deal_stage' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.deal_stage AS ENUM (
      'Discover / Qualified',
      'Intro & Scoping',
      'Proposal / Pilot',
      'Negotiation / Legal',
      'Closed-Won / Pilot Go',
      'Closed-Lost / On Hold'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'deal_confidence' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.deal_confidence AS ENUM ('Low', 'Medium', 'High');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'match_status' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.match_status AS ENUM ('pending', 'accepted', 'declined', 'introduced');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'response_status' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.response_status AS ENUM ('pending', 'accepted', 'declined');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'event_type' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.event_type AS ENUM ('dinner', 'pitch-night', 'masterclass', 'session');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'document_status' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE public.document_status AS ENUM ('submitted', 'under-review', 'approved', 'rejected');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role public.app_role NOT NULL,
  permission public.app_permission NOT NULL,
  UNIQUE (role, permission)
);

INSERT INTO public.role_permissions (role, permission)
VALUES
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
  SELECT role
  INTO user_role
  FROM public.user_roles
  WHERE user_id = (event->>'user_id')::uuid;

  claims := event->'claims';

  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  event := jsonb_set(event, '{claims}', claims);

  RETURN event;
END;
$$;

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM anon, authenticated, public;

CREATE OR REPLACE FUNCTION public.authorize(requested_permission public.app_permission)
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
  SELECT (auth.jwt() ->> 'user_role')::public.app_role INTO user_role;

  SELECT count(*)
  INTO has_permission
  FROM public.role_permissions
  WHERE role = user_role
    AND permission = requested_permission;

  RETURN has_permission > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'member')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  business_name text,
  role_title text,
  city text,
  short_bio text,
  sector text,
  employee_band text,
  annual_revenue_estimate text,
  stage public.member_stage NOT NULL DEFAULT '0',
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  account_status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.member_asks_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind public.ask_offer_kind NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_a_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_b_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fit_score int CHECK (fit_score >= 0 AND fit_score <= 100),
  summary text,
  rationale jsonb,
  status public.match_status NOT NULL DEFAULT 'pending',
  member_a_status public.response_status NOT NULL DEFAULT 'pending',
  member_b_status public.response_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT matches_distinct_members CHECK (member_a_id <> member_b_id)
);

CREATE TABLE IF NOT EXISTS public.deal_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  match_id uuid REFERENCES public.matches(id) ON DELETE SET NULL,
  buyer_member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stage public.deal_stage NOT NULL DEFAULT 'Discover / Qualified',
  fit_score int CHECK (fit_score >= 0 AND fit_score <= 100),
  confidence public.deal_confidence NOT NULL DEFAULT 'Medium',
  impact_projection text,
  next_action text,
  next_action_due timestamptz,
  blocker text,
  close_reason_code text,
  last_updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.member_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_path text NOT NULL,
  status public.document_status NOT NULL DEFAULT 'submitted',
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamptz,
  reject_reason text,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type public.event_type NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  location text,
  min_stage public.member_stage NOT NULL DEFAULT '0',
  max_attendees int,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registered_at timestamptz NOT NULL DEFAULT now(),
  attended boolean NOT NULL DEFAULT false,
  pitch_credit int NOT NULL DEFAULT 0,
  UNIQUE (event_id, member_id)
);

CREATE TABLE IF NOT EXISTS public.ad_credit_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  change_amount int NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_member_asks_offers_member ON public.member_asks_offers(member_id);
CREATE INDEX IF NOT EXISTS idx_matches_member_a ON public.matches(member_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_member_b ON public.matches(member_b_id);
CREATE INDEX IF NOT EXISTS idx_deal_cards_buyer ON public.deal_cards(buyer_member_id);
CREATE INDEX IF NOT EXISTS idx_deal_cards_provider ON public.deal_cards(provider_member_id);
CREATE INDEX IF NOT EXISTS idx_documents_member ON public.member_documents(member_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_member ON public.event_registrations(member_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_member ON public.ad_credit_ledger(member_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_asks_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_credit_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles read" ON public.profiles;
CREATE POLICY "profiles read"
ON public.profiles
FOR SELECT
TO authenticated
USING (authorize('profiles.read') OR id = auth.uid());

DROP POLICY IF EXISTS "profiles update" ON public.profiles;
CREATE POLICY "profiles update"
ON public.profiles
FOR UPDATE
TO authenticated
USING (authorize('profiles.update') OR id = auth.uid())
WITH CHECK (authorize('profiles.update') OR id = auth.uid());

DROP POLICY IF EXISTS "profiles insert self" ON public.profiles;
CREATE POLICY "profiles insert self"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() OR authorize('profiles.admin'));

DROP POLICY IF EXISTS "member asks/offers own rows" ON public.member_asks_offers;
CREATE POLICY "member asks/offers own rows"
ON public.member_asks_offers
FOR ALL
TO authenticated
USING (member_id = auth.uid() OR authorize('profiles.admin'))
WITH CHECK (member_id = auth.uid() OR authorize('profiles.admin'));

DROP POLICY IF EXISTS "matches participant read" ON public.matches;
CREATE POLICY "matches participant read"
ON public.matches
FOR SELECT
TO authenticated
USING (
  member_a_id = auth.uid()
  OR member_b_id = auth.uid()
  OR authorize('profiles.admin')
);

DROP POLICY IF EXISTS "matches participant update" ON public.matches;
CREATE POLICY "matches participant update"
ON public.matches
FOR UPDATE
TO authenticated
USING (
  member_a_id = auth.uid()
  OR member_b_id = auth.uid()
  OR authorize('profiles.admin')
)
WITH CHECK (
  member_a_id = auth.uid()
  OR member_b_id = auth.uid()
  OR authorize('profiles.admin')
);

DROP POLICY IF EXISTS "deal cards participant access" ON public.deal_cards;
CREATE POLICY "deal cards participant access"
ON public.deal_cards
FOR ALL
TO authenticated
USING (
  buyer_member_id = auth.uid()
  OR provider_member_id = auth.uid()
  OR authorize('profiles.admin')
)
WITH CHECK (
  buyer_member_id = auth.uid()
  OR provider_member_id = auth.uid()
  OR authorize('profiles.admin')
);

DROP POLICY IF EXISTS "documents owner read" ON public.member_documents;
CREATE POLICY "documents owner read"
ON public.member_documents
FOR SELECT
TO authenticated
USING (member_id = auth.uid() OR authorize('profiles.admin'));

DROP POLICY IF EXISTS "documents owner insert" ON public.member_documents;
CREATE POLICY "documents owner insert"
ON public.member_documents
FOR INSERT
TO authenticated
WITH CHECK (member_id = auth.uid() OR authorize('profiles.admin'));

DROP POLICY IF EXISTS "documents owner update" ON public.member_documents;
CREATE POLICY "documents owner update"
ON public.member_documents
FOR UPDATE
TO authenticated
USING (member_id = auth.uid() OR authorize('profiles.admin'))
WITH CHECK (member_id = auth.uid() OR authorize('profiles.admin'));

DROP POLICY IF EXISTS "events visible to authenticated" ON public.events;
CREATE POLICY "events visible to authenticated"
ON public.events
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "events admin manage" ON public.events;
CREATE POLICY "events admin manage"
ON public.events
FOR ALL
TO authenticated
USING (authorize('content.create'))
WITH CHECK (authorize('content.create'));

DROP POLICY IF EXISTS "registrations owner access" ON public.event_registrations;
CREATE POLICY "registrations owner access"
ON public.event_registrations
FOR ALL
TO authenticated
USING (member_id = auth.uid() OR authorize('profiles.admin'))
WITH CHECK (member_id = auth.uid() OR authorize('profiles.admin'));

DROP POLICY IF EXISTS "credits owner read" ON public.ad_credit_ledger;
CREATE POLICY "credits owner read"
ON public.ad_credit_ledger
FOR SELECT
TO authenticated
USING (member_id = auth.uid() OR authorize('profiles.admin'));

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at := now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS trg_member_asks_offers_updated_at ON public.member_asks_offers;
CREATE TRIGGER trg_member_asks_offers_updated_at
BEFORE UPDATE ON public.member_asks_offers
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS trg_matches_updated_at ON public.matches;
CREATE TRIGGER trg_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS trg_deal_cards_updated_at ON public.deal_cards;
CREATE TRIGGER trg_deal_cards_updated_at
BEFORE UPDATE ON public.deal_cards
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
