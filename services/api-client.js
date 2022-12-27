import axios, { AxiosError } from "axios";
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

function getBaseUrl() {
	const environment = process.env.NODE_ENV;
	if (environment === "development") return "http://localhost:3000/api";
	return `https://${process.env.VERCEL_URL}/api`;
}
