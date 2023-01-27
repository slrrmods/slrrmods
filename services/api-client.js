import axios, { AxiosError } from "axios";
import { ENVIROMENT_URL } from "../utils/constants";
import { newBase64Uuid } from "../utils/uuid";

const api = axios.create({
	baseURL: `${ENVIROMENT_URL}/api`,
	withCredentials: true,
});

const clientToken = newBase64Uuid();

export async function doApiRequest(url, method, headers, data) {
	headers = getDefaultHeaders(headers);

	const config = {
		url,
		method,
		headers,
		data,
	};

	try {
		const response = await api(config);

		if (response.data.error) throw new Error(response.data.error);

		return response.data;
	} catch (error) {
		if (!(error instanceof AxiosError)) throw error;

		const { response } = error;

		if (!response) throw new Error(error.message);

		if (response.data.error) throw new Error(response.data.error);

		throw new Error("Unknown error");
	}
}

function getDefaultHeaders(headers, data) {
	if (!headers) headers = {};

	headers["Request-Token"] = newBase64Uuid();
	headers["Client-Token"] = clientToken;
	if (data) headers["Content-Type"] = "application/json";

	securityHeaders.forEach((header) => {
		headers[header.key] = header.value;
	});

	return headers;
}

const securityHeaders = [
	{
		key: "Content-Security-Policy",
		value:
			"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' https://vercel.live/ 'unsafe-eval';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
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
