import axios, { AxiosError } from "axios";
import { ENVIROMENT_URL } from "../utils/constants";
import { newBase64Uuid } from "../utils/uuid";

const api = axios.create({
	baseURL: `${ENVIROMENT_URL}/api`,
	withCredentials: true,
});

const clientToken = newBase64Uuid();

export async function doApiRequest(url, method, headers, data) {
	if (!headers) headers = {};

	headers["request-token"] = newBase64Uuid();
	headers["client-token"] = clientToken;

	if (data) headers["content-type"] = "application/json";

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
