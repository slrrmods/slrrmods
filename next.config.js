const securityHeaders = [
	{
		key: "Content-Security-Policy",
		value:
			"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' 'unsafe-eval';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
	},
	{
		key: "Cross-Origin-Embedder-Policy",
		value: "require-corp",
	},
	{
		key: "Cross-Origin-Opener-Policy",
		value: "same-origin",
	},
	{
		key: "Cross-Origin-Resource-Policy",
		value: "same-origin",
	},
	{
		key: "Origin-Agent-Cluster",
		value: "?1",
	},
	{
		key: "Referrer-Policy",
		value: "origin",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=15552000; includeSubDomains",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "X-DNS-Prefetch-Control",
		value: "off",
	},
	{
		key: "X-Download-Options",
		value: "noopen",
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN",
	},
	{
		key: "X-Permitted-Cross-Domain-Policies",
		value: "none",
	},
	{
		key: "X-XSS-Protection",
		value: "0",
	},
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async headers() {
		return [
			{
				source: "/:path*",
				headers: securityHeaders,
			},
		];
	},
};

module.exports = nextConfig;
