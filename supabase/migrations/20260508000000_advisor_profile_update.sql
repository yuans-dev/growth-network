-- Grant advisor role permission to update member profiles
-- Required for stage progression, verification approval, and account suspension actions

INSERT INTO public.role_permissions (role, permission)
VALUES ('advisor', 'profiles.update')
ON CONFLICT DO NOTHING;
