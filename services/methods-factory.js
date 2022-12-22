import { apiClient } from "./";
import { urlBuilder } from "../utils";

export function createMethods() {
	return {
		get: createMethod("GET"),
		post: createMethod("POST"),
		put: createMethod("PUT"),
		delete: createMethod("DELETE"),
		patch: createMethod("PATCH"),
	};
}

function createMethod(method) {
	return (endpoint, options) => {
		if (!endpoint) throw new Error("Endpoint is required");

		const { headers, params, body } = options;

		const route = urlBuilder.buildUrl(endpoint, params);

		return apiClient.doApiRequest(route, method, headers ?? {}, body);
	};
}
