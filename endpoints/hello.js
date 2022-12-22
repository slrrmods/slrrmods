import { methodsFactory } from "../services";

const { get } = methodsFactory.createMethods();

export function sayHello(name) {
	const params = { name };

	return get("/hello", { params });
}
