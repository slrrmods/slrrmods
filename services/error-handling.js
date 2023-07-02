import { ENVIROMENT_URL } from "../utils/constants";
import { sendHtml } from "./email-sender";
import { createClient } from "./supabase-client";

const client = createClient();

export async function logError(error, context) {
	await client.from("api_errors").insert({
		error,
		context
	});
}

export async function reportToEmail(error, context) {
	if (!process.env.SEND_ERROR_REPORT_EMAIL) return;

	const reportEmail = process.env.ERROR_REPORT_EMAIL;
	const subject = "SLRR Mods - Error report";
	const body = `<h1>Error report</h1>
            <br/>
            <p>Enviroment: ${ENVIROMENT_URL}</p>
            <br/>
            <p>Error: ${error}</p>
            <br/>
            <p>Context: ${JSON.stringify(context)}</p>
            `;

	await sendHtml(reportEmail, subject, body);
}
