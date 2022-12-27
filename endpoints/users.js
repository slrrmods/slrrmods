import { methodsFactory } from "../services";

const { get } = methodsFactory.createMethods();

export function checkEmailAvailable(email) {
	const params = { email };

	return get("/users/checkEmailAvailable", { params });
}

export function checkUsernameAvailable(username) {
	const params = { username };

	return get("/users/checkUsernameAvailable", { params });
}
