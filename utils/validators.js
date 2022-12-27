const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export function validateEmail(email) {
	if (!email) return false;

	return emailRegex.test(email);
}
