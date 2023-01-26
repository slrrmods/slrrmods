-- 
-- Create sessions table
--
CREATE TABLE public.sessions
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    ip TEXT NOT NULL,
    location TEXT NOT NULL,
    sso BOOLEAN NOT NULL DEFAULT FALSE,
    token TEXT
);

--
-- Create api_errors table
--
CREATE TABLE public.api_errors
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    error TEXT NOT NULL,
    context JSONB NOT NULL
);