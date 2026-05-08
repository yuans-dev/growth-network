-- Grant advisor role full platform management permission
-- Required for reading and updating member documents, deal cards,
-- event registrations, and credit ledger across all members

INSERT INTO public.role_permissions (role, permission)
VALUES ('advisor', 'profiles.admin')
ON CONFLICT DO NOTHING;
