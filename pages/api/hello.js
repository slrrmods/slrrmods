import ApiMiddleware from "../../ApiMiddleware";
import { configurarion } from "../../ApiEndpoints/hello";

export default function handler(req, res) {
	ApiMiddleware(req, res, configurarion);
}
