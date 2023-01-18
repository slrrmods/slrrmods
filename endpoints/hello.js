import { createMethods } from "../services/methods-factory";

const { get } = createMethods();

export function sayHello(name) {
	const query = { name };

	return get("/hello", { query });
}
