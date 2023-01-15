-- 
-- Create users table
--
CREATE TABLE public.users 
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    birthday DATE,
    id_country UUID REFERENCES countries(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    email TEXT NOT NULL UNIQUE,
    email_confirmation_sent_at TIMESTAMP,
    email_confirmation_token TEXT,
    email_confirmed_at TIMESTAMP,
    last_sign_in_at TIMESTAMP NOT NULL DEFAULT NOW(),
    level INTEGER NOT NULL DEFAULT 0,
    password TEXT NOT NULL,
    password_recovered_at TIMESTAMP,
    password_recovery_sent_at TIMESTAMP,
    password_recovery_token TEXT,
    profile_picture TEXT,
    respect INTEGER NOT NULL DEFAULT 0,
    signature TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    username TEXT NOT NULL UNIQUE
);

--
-- Create function to update users updated_at column
--
CREATE FUNCTION public.update_updated_at_column() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

--
-- Create trigger to update users updated_at column
--
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();