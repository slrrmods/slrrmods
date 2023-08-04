import { NextApiRequest, NextApiResponse } from "next";
import { ObjectSchema } from "yup";

export type ApiHandlerResponse = {
	status: number;
	data?: any;
	error?: any;
};

export type ApiHandlerContext = {
	request: NextApiRequest;
	response: NextApiResponse;
	method: string;
	methodConfiguration: MethodConfiguration;
	endpointConfiguration: EndpointConfiguration;
	query: any;
	body: any;
	headers: any;
};

export type MethodHandler = (
	context: ApiHandlerContext
) => ApiHandlerResponse | Promise<ApiHandlerResponse>;

export type MethodRateLimiting = {
	limit?: number;
	interval?: number;
	usersPerSecond?: number;
};

export type MethodAuthorization = {
	authentication: "public" | "authenticated" | "admin";
	roles?: string[];
};

export type MethodConfiguration = {
	query?: ObjectSchema<any>;
	body?: ObjectSchema<any>;
	headers?: ObjectSchema<any>;
	authorization?: MethodAuthorization;
	rateLimiting?: MethodRateLimiting;
	handler: MethodHandler;
};

export type EndpointConfiguration = {
	GET?: MethodConfiguration;
	POST?: MethodConfiguration;
	PUT?: MethodConfiguration;
	DELETE?: MethodConfiguration;
	PATCH?: MethodConfiguration;
};
