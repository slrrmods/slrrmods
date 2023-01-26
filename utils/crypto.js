import crypto from "crypto";

export function encrypt(text) {
	const key = process.env.CRYPTO_KEY;
	const iv = process.env.CRYPTO_IV;
	const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

	let encrypted = cipher.update(text, "utf8", "hex");
	encrypted += cipher.final("hex");

	return encrypted;
}

export function decrypt(text) {
	const key = process.env.CRYPTO_KEY;
	const iv = process.env.CRYPTO_IV;
	const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

	let decrypted = decipher.update(text, "hex", "utf8");
	decrypted += decipher.final("utf8");

	return decrypted;
}
