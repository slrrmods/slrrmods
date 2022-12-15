import * as yup from "yup";

export const configurarion = {
	GET: {
		role: "public",
		headers: {},
		body: {},
		query: yup.object().shape({
			name: yup.string().required(),
		}),
		handler: onGet,
	},
};

function onGet(req, res) {
	return res.status(200).json({ message: `Hello ${req.query.name}` });
}
