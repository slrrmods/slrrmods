import { THEME_COOKIE_KEY } from "@/client/utils";
import { getCookie } from "cookies-next";
import App, { AppContext } from "next/app";

export async function getInitialProps(appContext: AppContext) {
	const initialProps = await App.getInitialProps(appContext);

	const currentTheme = getCookie(THEME_COOKIE_KEY, appContext.ctx);

	return {
		...initialProps,
		currentTheme,
	};
}
