import { AxiosError } from "axios";

export function unwrapError(error) {
	if (!isAxiosError(error)) return error.message;

	const response = error.response;

	if (!response) return error.message;

	if (!response.data) return "Unknown error";

	return response.data.error || "Unknown error";
}

function isAxiosError(error) {
	return error instanceof AxiosError;
}
