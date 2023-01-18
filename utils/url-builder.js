export function buildUrl(url, query) {
	if (!query) return url;

	const urlParams = new URLSearchParams();

	Object.keys(query).forEach((key) => {
		const value = query[key];

		if (value !== null && value !== undefined) urlParams.append(key, value);
	});

	return `${url}?${urlParams.toString()}`;
}
