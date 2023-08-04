import { NextApiRequest } from "next";

const LOCAL_IP = "127.0.0.1";

export function getIp(request: NextApiRequest) {
	const forwardedFor = request.headers["x-forwarded-for"];
	if (forwardedFor) return getForwardedIp(forwardedFor);

	const remoteAddress = request.socket.remoteAddress;
	if (remoteAddress && remoteAddress.length > 5) remoteAddress;

	return LOCAL_IP;
}

function getForwardedIp(forwardedFor: string | string[]) {
	if (Array.isArray(forwardedFor)) return forwardedFor[0];
	return forwardedFor.split(",")[0];
}
