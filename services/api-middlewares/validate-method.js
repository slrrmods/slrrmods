import { ValidationError } from "../../classes";

export default function validateMethod({ configuration, request }) {
	if (configuration === undefined)
		throw new ValidationError(`Method '${request.method}' not allowed`, 405);
}
