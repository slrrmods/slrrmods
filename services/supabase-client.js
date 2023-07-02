import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { IS_SERVER_ENV } from "../utils/constants";

let client;

export function createClient() {
	if (client) return client;

	if (IS_SERVER_ENV) client = createForServer();
	else client = createForClient();

	return client;
}

function createForClient() {
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_ANON_KEY;

	return createGenericClient(supabaseUrl, supabaseKey);
}

function createForServer() {
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

	return createGenericClient(supabaseUrl, supabaseKey);
}

function createGenericClient(url, key) {
	return createSupabaseClient(url, key, {
		auth: { persistSession: false }
	});
}
