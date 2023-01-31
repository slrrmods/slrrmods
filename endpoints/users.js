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

export function signIn(username, password, sso) {
	const data = { username, password, sso };

	return post("/users/signIn", { data });
}

export function signUp(email, username, password) {
	const data = { email, username, password };

	return post("/users/signUp", { data });
}

export function resendEmailVerification(token) {
	const query = { token };

	return post("/users/resendEmailVerification", { query });
}

export function sendResetPassword(email) {
	const data = { email };

	return post("/users/sendResetPassword", { data });
}

export function resetPassword(token, password) {
	const data = { token, password };

	return post("/users/resetPassword", { data });
}

export function getUserInfo() {
	return get("/users/getUserInfo");
}

export function signOff() {
	return post("/users/signOff");
}
