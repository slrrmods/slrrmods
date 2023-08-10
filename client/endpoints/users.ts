import { createMethods } from "@client/services";
import {
	EmailAvailableResponse,
	UsernameAvailableResponse,
} from "@common/types";

const { get } = createMethods();

export function checkEmailAvailable(email: string) {
	return get<EmailAvailableResponse>("users/checkEmailAvailable", {
		query: { email },
	});
}

export function checkUsernameAvailable(username: string) {
	return get<UsernameAvailableResponse>("users/checkUsernameAvailable", {
		query: { username },
	});
}
