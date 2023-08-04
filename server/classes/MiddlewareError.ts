export default class MiddlewareError extends Error {
	status: number;
	details?: string;

	constructor(status: number, message: string, details?: string) {
		super(message);
		this.status = status;
		this.name = "MiddlewareError";
		this.details = details;
	}
}
