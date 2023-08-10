import { NextApiRequest, NextApiResponse } from "next";
import { ObjectSchema } from "yup";

export type Endpoint = {
	GET?: Method;
	POST?: Method;
	PUT?: Method;
	DELETE?: Method;
	PATCH?: Method;
};

export type Method = {
	query?: ObjectSchema<any>;
	body?: ObjectSchema<any>;
	headers?: ObjectSchema<any>;
	authorization?: Authorization;
	rateLimiting?: RateLimiting;
	handler: Handler;
};

export type Authorization = {
	authentication: "public" | "authenticated" | "admin";
	roles?: string[];
};

export type RateLimiting = {
	limit?: number;
	interval?: number;
	usersPerSecond?: number;
};

export type Handler = (
	context: HandlerContext
) => Result<T> | Promise<Result<T>>;

export type HandlerContext = {
	request: NextApiRequest;
	response: NextApiResponse;
	method: string;
	methodConfiguration: Method;
	endpointConfiguration: Endpoint;
	query: any;
	body: any;
	headers: Headers;
};

export type Headers = {
	requestId: string;
	clientId: string;
};

export type Result<T> = {
	status: number;
	data?: T;
	error?: Error;
};

export type Error = {
	message: string;
};
