import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
	if (typeof window === "undefined") return createForServer();
	return createForClient();
}

function createForClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	return createSupabaseClient(supabaseUrl, supabaseKey);
}

function createForServer() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

	return createSupabaseClient(supabaseUrl, supabaseKey);
}
