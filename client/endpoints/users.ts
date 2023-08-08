import { createMethods } from "@client/services";

const { get } = createMethods();

export function checkEmailAvailable(email: string) {
	const query = { email };
	return get("users/checkEmailAvailable", { query });
}
