import { methodsFactory } from "../services";

const { get, post } = methodsFactory.createMethods();

export function checkEmailAvailable(email) {
	const params = { email };

	return get("/users/checkEmailAvailable", { params });
}

export function checkUsernameAvailable(username) {
	const params = { username };

	return get("/users/checkUsernameAvailable", { params });
}

export function signUp(email, username, password) {
	const body = { email, username, password };

	return post("/users/signUp", { body });
}
