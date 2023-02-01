export default class ValidationError extends Error {
	constructor(message, status = 400) {
		super(message);
		this.status = status;
		this.name = "ValidationError";
	}
}
