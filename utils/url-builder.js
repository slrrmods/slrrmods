export function buildUrl(url, params) {
	if (!params) return url;

	const urlParams = new URLSearchParams();

	Object.keys(params).forEach((key) => {
		const value = params[key];

		if (value !== null && value !== undefined) urlParams.append(key, value);
	});

	return `${url}?${urlParams.toString()}`;
}
