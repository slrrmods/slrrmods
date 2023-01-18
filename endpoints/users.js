import { createMethods } from "../services/methods-factory";

const { get, post } = createMethods();

export function checkEmailAvailable(email) {
	const query = { email };

	return get("/users/checkEmailAvailable", { query });
}

export function checkUsernameAvailable(username) {
	const query = { username };

	return get("/users/checkUsernameAvailable", { query });
}

export function signUp(email, username, password) {
	const data = { email, username, password };

	return post("/users/signUp", { data });
}

export function resendEmailVerification(token) {
	const query = { token };

	return post("/users/resendEmailVerification", { query });
}
