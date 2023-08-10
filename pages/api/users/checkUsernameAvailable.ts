import { UsernameAvailableResponse } from "@common/types";
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
			username: yup.string().required(),
		}),
		handler: onGet,
	},
};

interface GetContext extends HandlerContext {
	query: {
		username: string;
	};
}

function onGet({ query }: GetContext): Result<UsernameAvailableResponse> {
	const { username } = query;

	if (username === "adnan54") {
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
