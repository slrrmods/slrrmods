import { createTransport } from "nodemailer";
import { ENVIROMENT_URL } from "../utils/constants";
import { compile } from "handlebars";

const transporter = createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const emailTemplate =
	"PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PG1ldGEgY2hhcnNldD0idXRmLTgiPjxtZXRhIGh0dHAtZXF1aXY9IngtdWEtY29tcGF0aWJsZSIgY29udGVudD0iaWU9ZWRnZSI+PHRpdGxlPkVtYWlsIENvbmZpcm1hdGlvbjwvdGl0bGU+PG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCxpbml0aWFsLXNjYWxlPTEiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+KnttYXJnaW46MH0uYm9keXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlfS5jb250YWluZXJ7YmFja2dyb3VuZC1jb2xvcjojZjhmOWZhO2NvbG9yOiMzNDNhNDA7Zm9udC1zaXplOjE2cHg7bGluZS1oZWlnaHQ6MS41NTtmb250LWZhbWlseTpBcmlhbDt0ZXh0LWFsaWduOmNlbnRlcn0udGl0bGV7Zm9udC1mYW1pbHk6J0FyaWFsIEJsYWNrJztjb2xvcjojZmZmO2JhY2tncm91bmQtY29sb3I6IzE5NzFjMjtwYWRkaW5nOjEwcHh9LmNvbnRlbnR7bWFyZ2luOjI1cHg7bWFyZ2luLXRvcDoxMHB4fS5idXR0b257cGFkZGluZzoxMHB4IDUwcHg7Ym9yZGVyOjFweCBzb2xpZCB0cmFuc3BhcmVudDtib3JkZXItcmFkaXVzOjRweDtmb250LXNpemU6MThweDtmb250LXdlaWdodDo2MDA7YmFja2dyb3VuZC1jb2xvcjojMTk3MWMyO2N1cnNvcjpwb2ludGVyO3RleHQtZGVjb3JhdGlvbjpub25lfS5idXR0b246aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojMWM3ZWQ2fS5zcGFue2NvbG9yOiNmZmZ9Lndhcm5pbmd7bWFyZ2luOjI1cHg7Y29sb3I6Izg2OGU5Njtmb250LXNpemU6MTRweDtmb250LXN0eWxlOml0YWxpY308L3N0eWxlPjwvaGVhZD48Ym9keSBjbGFzcz0iYm9keSI+PGRpdiBjbGFzcz0iY29udGFpbmVyIj48ZGl2IGNsYXNzPSJ0aXRsZSI+PGgxPlNMUlIgTW9kczwvaDE+PC9kaXY+PGgyIHN0eWxlPSJmb250LXdlaWdodDo2MDA7bWFyZ2luLXRvcDoxMHB4Ij5Db25maXJtIFlvdXIgRW1haWwgQWRkcmVzczwvaDI+PGRpdiBjbGFzcz0iY29udGVudCI+PHA+SGkge3t1c2VybmFtZX19LCB3ZWxjb21lIHRvIFNMUlIgTW9kcyE8L3A+PHA+VGFwIHRoZSBidXR0b24gYmVsb3cgdG8gY29uZmlybSB5b3VyIGVtYWlsIGFkZHJlc3MuPC9wPjwvZGl2PjxhIGNsYXNzPSJidXR0b24iIGhyZWY9Int7dXJsfX0iIHRhcmdldD0iX2JsYW5rIj48c3BhbiBjbGFzcz0ic3BhbiI+VmVyaWZ5IEVtYWlsPC9zcGFuPjwvYT48cCBjbGFzcz0id2FybmluZyI+SWYgeW91IGRpZG4ndCBjcmVhdGUgYW4gYWNjb3VudCB3aXRoIFNMUlIgTW9kcywgeW91IGNhbiBzYWZlbHkgZGVsZXRlIHRoaXMgZW1haWwuPC9wPjwvZGl2PjwvYm9keT48L2h0bWw+";

export async function sendVerificationEmail(to, username, token) {
	const template = Buffer.from(emailTemplate, "base64").toString("ascii");
	const compiledTemplate = compile(template);
	const values = {
		username,
		url: `${ENVIROMENT_URL}/verifyEmail?token=${token}`,
	};
	const html = compiledTemplate(values);

	return await sendHtml(to, "SLRR Mods - please verify your email", html);
}

export async function sendHtml(to, subject, html) {
	var options = {
		from: process.env.EMAIL_ADDRESS,
		to,
		subject,
		html,
	};

	return await sendEmail(options);
}

export async function sendText(email, subject, text) {
	var options = {
		from: process.env.EMAIL_ADDRESS,
		to: email,
		subject,
		text,
	};

	return await sendEmail(options);
}

async function sendEmail(options) {
	return await transporter.sendMail(options);
}
