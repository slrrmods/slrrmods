import { createClient } from "../services/supabase-client";

const client = createClient();

export async function getById(id) {
	const { data } = await client
		.from("countries")
		.select()
		.eq("id", id)
		.maybeSingle();
	return data;
}

export async function getAll() {
	const { data } = await client.from("countries").select();
	return data;
}
