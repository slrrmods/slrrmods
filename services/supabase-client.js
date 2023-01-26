import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { IS_IN_SERVER_ENV } from "../utils/constants";

let client = null;

export function createClient() {
	if (client !== null) return client;

	if (IS_IN_SERVER_ENV) client = createForServer();
	else client = createForClient();

	return client;
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
