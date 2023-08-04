import {
	ApiHandlerContext,
	EndpointConfiguration,
	handleRequest,
} from "@server/api-handler";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const querySchema = yup.object().shape({
	email: yup.string().email().required(),
});

const configuration: EndpointConfiguration = {
	GET: {
		query: querySchema,
		handler: onGet,
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	return await handleRequest(req, res, configuration);
}

interface GetContext extends ApiHandlerContext {
	query: yup.InferType<typeof querySchema>;
}

function onGet({ query }: GetContext) {
	const { email } = query;

	if (email === "adnan_silva54@hotmail.com") {
		return {
			status: 409,
			data: { message: "Email already in use" },
		};
	}

	return {
		status: 200,
		data: { message: "Email available" },
	};
}
