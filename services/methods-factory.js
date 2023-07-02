import { buildUrl } from "../utils/url-builder";
import { doApiRequest } from "./api-client";

export function createMethods() {
	return {
		get: createMethod("GET"),
		post: createMethod("POST"),
		put: createMethod("PUT"),
		delete: createMethod("DELETE"),
		patch: createMethod("PATCH")
	};
}

function createMethod(method) {
	return (endpoint, options = {}) => {
		if (!endpoint) throw new Error("Endpoint is required");

		const { headers, query, data } = options;
		const url = buildUrl(endpoint, query);

		return doApiRequest(url, method, headers, data);
	};
}
