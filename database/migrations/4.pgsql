--
-- Update email and username to be case insensitive int users table
--
ALTER TABLE public.users ALTER COLUMN email TYPE CITEXT;
ALTER TABLE public.users ALTER COLUMN username TYPE CITEXT;

--
-- Create refresh_tokens table
--
CREATE TABLE public.refresh_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session UUID REFERENCES public.sessions(id) NOT NULL,
    token text NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    used_at TIMESTAMPTZ
);