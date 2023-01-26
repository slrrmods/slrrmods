export function getIp(request) {
	const xForwardedFor =
		request instanceof Request
			? request.headers.get("x-forwarded-for")
			: request.headers["x-forwarded-for"];

	if (xForwardedFor) {
		if (Array.isArray(xForwardedFor)) return xForwardedFor[0];
		else return xForwardedFor.split(",")[0];
	}

	const remoteAddress = request.connection?.remoteAddress;
	if (remoteAddress && String(remoteAddress).length >= 5) return remoteAddress;

	return "127.0.0.1";
}
