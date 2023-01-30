import { createTransport } from "nodemailer";

const transporter = createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASSWORD,
	},
});

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
