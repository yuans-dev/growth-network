ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS how_heard_about text,
  ADD COLUMN IF NOT EXISTS referred_by text,
  ADD COLUMN IF NOT EXISTS phone_whatsapp text,
  ADD COLUMN IF NOT EXISTS years_in_operation text,
  ADD COLUMN IF NOT EXISTS ask_categories text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS offer_categories text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS asks_summary text,
  ADD COLUMN IF NOT EXISTS offers_summary text,
  ADD COLUMN IF NOT EXISTS open_to_new_business_conversations text,
  ADD COLUMN IF NOT EXISTS primary_goal text,
  ADD COLUMN IF NOT EXISTS attend_monthly_dinner text,
  ADD COLUMN IF NOT EXISTS pdpa_matching_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS additional_notes text;

COMMENT ON COLUMN public.profiles.how_heard_about IS 'Onboarding source channel';
COMMENT ON COLUMN public.profiles.referred_by IS 'Referral source name, if applicable';
COMMENT ON COLUMN public.profiles.phone_whatsapp IS 'Primary phone or WhatsApp contact';
COMMENT ON COLUMN public.profiles.years_in_operation IS 'Years in operation bucket';
COMMENT ON COLUMN public.profiles.ask_categories IS 'Selected ask categories for matching';
COMMENT ON COLUMN public.profiles.offer_categories IS 'Selected offer categories for matching';
COMMENT ON COLUMN public.profiles.asks_summary IS '1-2 sentence summary of current asks';
COMMENT ON COLUMN public.profiles.offers_summary IS '1-2 sentence summary of current offers';
COMMENT ON COLUMN public.profiles.open_to_new_business_conversations IS 'Availability for new business conversations';
COMMENT ON COLUMN public.profiles.primary_goal IS 'Primary goal for joining';
COMMENT ON COLUMN public.profiles.attend_monthly_dinner IS 'Willingness to attend monthly in-person dinner';
COMMENT ON COLUMN public.profiles.pdpa_matching_consent IS 'Consent for using professional data in business matching';
COMMENT ON COLUMN public.profiles.additional_notes IS 'Extra notes from onboarding';