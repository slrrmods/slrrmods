import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { IS_SERVER_ENV } from "../utils/constants";

let client = null;

export function createClient() {
	if (client !== null) return client;

	if (IS_SERVER_ENV) client = createForServer();
	else client = createForClient();

	return client;
}

function createForClient() {
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_ANON_KEY;

	return createSupabaseClient(supabaseUrl, supabaseKey);
}

function createForServer() {
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

	return createSupabaseClient(supabaseUrl, supabaseKey);
}
