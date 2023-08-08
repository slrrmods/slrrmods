import { v4, validate } from "uuid";

export function newUuid() {
	return v4();
}

export function newBase64Uuid() {
	return Buffer.from(newUuid()).toString("base64");
}

export function isValid(uuid: string) {
	return validate(uuid);
}

export function isBase64Valid(uuid: string) {
	const decoded = Buffer.from(uuid, "base64").toString("ascii");
	return isValid(decoded);
}
