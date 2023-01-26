export function toBase64(text) {
	return Buffer.from(text).toString("base64url");
}

export function fromBase64(text) {
	return Buffer.from(text, "base64url").toString();
}
