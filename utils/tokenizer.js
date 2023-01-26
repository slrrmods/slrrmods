import crypto from "crypto";
import { newBase64Uuid } from "./uuid";
import { toBase64 } from "./base64";

export function createRandomToken() {
	const uuid = newBase64Uuid();
	const random = crypto.randomBytes(32).toString("hex");
	const token = `${uuid}.${random}`;
	return toBase64(token).substring(0, 32);
}
