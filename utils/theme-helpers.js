export const getFilledBackground = (theme) => {
	return theme.fn.variant({ variant: "filled", color: theme.primaryColor })
		.background;
};

export const getLightFilledBackground = (theme, alpha) => {
	if (alpha < 0) return getDarkFilledBackground(theme, alpha);

	return theme.fn.lighten(getFilledBackground(theme), alpha);
};

export const getDarkFilledBackground = (theme, alpha) => {
	if (alpha < 0) return getLightFilledBackground(theme, alpha);

	return theme.fn.darken(getFilledBackground(theme), alpha);
};

export const getFromConditional = (theme, dark, light) => {
	if (theme.colorScheme === "dark") return dark;
	return light;
};
