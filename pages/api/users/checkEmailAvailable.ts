import { EmailAvailableResponse } from "@common/types";
import {
	Endpoint,
	HandlerContext,
	Result,
	handleRequest,
} from "@server/api-handler";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const configuration: Endpoint = {
	GET: {
		query: yup.object().shape({
			email: yup.string().email().required(),
		}),
		handler: onGet,
	},
};

interface GetContext extends HandlerContext {
	query: {
		email: string;
	};
}

function onGet({ query }: GetContext): Result<EmailAvailableResponse> {
	const { email } = query;

	if (email === "adnan_silva54@hotmail.com") {
		return {
			status: 409,
			data: { available: false },
		};
	}

	return {
		status: 200,
		data: { available: true },
	};
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	return await handleRequest(req, res, configuration);
}
