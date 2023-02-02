import { ValidationError } from "../../classes";

export default function validateAuthentication(context) {
	const { configuration } = context;

	if (!configuration.authentication) return;
	if (!context.user) throw new ValidationError("Authentication required", 401);
}
