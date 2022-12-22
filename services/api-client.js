import axios from "axios";
import { uuid } from "../utils";

const api = axios.create({
	baseURL: getBaseUrl(),
	withCredentials: true,
});

export async function doApiRequest(route, method, headers, body) {
	headers["request-id"] = uuid.getNew();

	if (body) headers["content-type"] = "application/json";

	const config = {
		url: route,
		method,
		headers,
		data: body,
	};

	const response = await api(config);
	return response.data || {};
}

function getBaseUrl() {
	const environment = process.env.NODE_ENV;
	if (environment === "development") return "http://localhost:3000/api";
	return `https://${process.env.VERCEL_URL}/api`;
}
