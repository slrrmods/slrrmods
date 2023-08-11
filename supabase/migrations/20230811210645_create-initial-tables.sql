create type "public"."continents" as enum ('Africa', 'Antarctica', 'Asia', 'Europe', 'Oceania', 'North America', 'South America');

create table "public"."api_errors" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "error" text not null,
    "context" jsonb not null
);


create table "public"."countries" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text,
    "iso2" text not null,
    "iso3" text,
    "local_name" text,
    "continent" continents
);


create table "public"."refresh_tokens" (
    "id" uuid not null default uuid_generate_v4(),
    "session" uuid not null,
    "token" text not null,
    "created_at" timestamp with time zone not null default now(),
    "revoked_at" timestamp with time zone,
    "used_at" timestamp with time zone
);


create table "public"."sessions" (
    "id" uuid not null default uuid_generate_v4(),
    "owner" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "expires_at" timestamp with time zone not null,
    "revoked_at" timestamp with time zone,
    "ip" text not null,
    "location" text not null,
    "sso" boolean not null default false,
    "token" text
);


create table "public"."users" (
    "id" uuid not null default uuid_generate_v4(),
    "active" boolean not null default true,
    "birthday" date,
    "id_country" uuid,
    "created_at" timestamp with time zone not null default now(),
    "email" text not null,
    "email_confirmation_sent_at" timestamp with time zone,
    "email_confirmation_token" text,
    "email_confirmed_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone not null default now(),
    "level" integer not null default 0,
    "password" text not null,
    "password_recovered_at" timestamp with time zone,
    "password_recovery_sent_at" timestamp with time zone,
    "password_recovery_token" text,
    "profile_picture" text,
    "respect" integer not null default 0,
    "signature" text,
    "updated_at" timestamp with time zone not null default now(),
    "username" text not null
);


CREATE UNIQUE INDEX api_errors_pkey ON public.api_errors USING btree (id);

CREATE UNIQUE INDEX countries_pkey ON public.countries USING btree (id);

CREATE UNIQUE INDEX refresh_tokens_pkey ON public.refresh_tokens USING btree (id);

CREATE UNIQUE INDEX sessions_pkey ON public.sessions USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

alter table "public"."api_errors" add constraint "api_errors_pkey" PRIMARY KEY using index "api_errors_pkey";

alter table "public"."countries" add constraint "countries_pkey" PRIMARY KEY using index "countries_pkey";

alter table "public"."refresh_tokens" add constraint "refresh_tokens_pkey" PRIMARY KEY using index "refresh_tokens_pkey";

alter table "public"."sessions" add constraint "sessions_pkey" PRIMARY KEY using index "sessions_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."refresh_tokens" add constraint "refresh_tokens_session_fkey" FOREIGN KEY (session) REFERENCES sessions(id) not valid;

alter table "public"."refresh_tokens" validate constraint "refresh_tokens_session_fkey";

alter table "public"."sessions" add constraint "sessions_owner_fkey" FOREIGN KEY (owner) REFERENCES users(id) not valid;

alter table "public"."sessions" validate constraint "sessions_owner_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_id_country_fkey" FOREIGN KEY (id_country) REFERENCES countries(id) not valid;

alter table "public"."users" validate constraint "users_id_country_fkey";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


