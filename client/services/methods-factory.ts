import {
	CLIENT_ID_HEADER_KEY,
	ENV_URL,
	REQUEST_ID_HEADER_KEY,
	newBase64Uuid,
} from "@common/utils";
import axios, { AxiosError } from "axios";

type RequestOptions = {
	headers?: any;
	body?: any;
	query?: any;
};

const api = axios.create({
	withCredentials: true,
});

const clientId = newBase64Uuid();

export function createMethods() {
	return {
		get: createMethod("GET"),
		post: createMethod("POST"),
		put: createMethod("PUT"),
		delete: createMethod("DELETE"),
		patch: createMethod("PATCH"),
	};
}

function createMethod(method: string) {
	return (endpoint: string, options: RequestOptions = {}) => {
		const { headers, query, body } = options;
		const url = buildUrl(endpoint, query);

		return doApiRequest(url, method, headers, body);
	};
}

function buildUrl(endpoint: string, query: any) {
	const url = new URL(endpoint, `${ENV_URL}/api/`);

	if (query) {
		const params = new URLSearchParams(query);
		url.search = params.toString();
	}

	return url;
}

async function doApiRequest(url: URL, method: string, headers: any, body: any) {
	headers = buildHeaders(headers, body);

	const config = {
		url: url.toString(),
		method,
		headers,
		data: body,
	};

	try {
		const response = await api(config);

		if (response.data.error) throw new Error(response.data.error);

		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) handleAxiosError(error);

		throw error;
	}
}

function buildHeaders(headers: any, body: any) {
	if (!headers) headers = {};

	headers[CLIENT_ID_HEADER_KEY] = clientId;
	headers[REQUEST_ID_HEADER_KEY] = newBase64Uuid();

	if (body) headers["Content-Type"] = "application/json";

	securityHeaders.forEach((header) => {
		headers[header.key] = header.value;
	});

	return headers;
}

const securityHeaders = [
	{
		key: "Content-Security-Policy",
		value:
			"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' 'unsafe-eval';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
	},
	{
		key: "Cross-Origin-Embedder-Policy",
		value: "require-corp",
	},
	{
		key: "Cross-Origin-Opener-Policy",
		value: "same-origin",
	},
	{
		key: "Cross-Origin-Resource-Policy",
		value: "same-origin",
	},
	{
		key: "Origin-Agent-Cluster",
		value: "?1",
	},
	{
		key: "Referrer-Policy",
		value: "origin",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=15552000; includeSubDomains",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "X-DNS-Prefetch-Control",
		value: "off",
	},
	{
		key: "X-Download-Options",
		value: "noopen",
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN",
	},
	{
		key: "X-Permitted-Cross-Domain-Policies",
		value: "none",
	},
	{
		key: "X-XSS-Protection",
		value: "0",
	},
];

function handleAxiosError(error: AxiosError) {
	const { response } = error;
	if (!response) throw new Error(error.message);

	const { data } = response;
	if (!data) throw new Error(error.message);

	if (data as { error: string })
		throw new Error((data as { error: string }).error);

	throw new Error("Unknown error");
}
