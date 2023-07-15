import { Link } from "@client/components";
import { Title, useMantineTheme } from "@mantine/core";

type Variants = "light" | "dark" | "colored" | "inherit";
type Sizes = "xs" | "sm" | "md" | "lg" | "xl";

export type LogoProps = {
	asAnchor?: boolean;
	variant?: Variants;
	size?: Sizes;
};

export function Logo({
	asAnchor = true,
	variant = "inherit",
	size = "md",
}: LogoProps) {
	const theme = useMantineTheme();

	function getOrder(size: Sizes) {
		if (size === "xs") return 5;
		if (size === "sm") return 4;
		if (size === "md") return 3;
		if (size === "lg") return 2;
		if (size === "xl") return 1;
	}

	function getColor(variant: Variants) {
		if (variant === "inherit") return undefined;
		if (variant === "light") return "white";
		if (variant === "dark") return "black";
		if (variant === "colored") return theme.fn.primaryColor();
	}

	const titleComponent = (
		<Title order={getOrder(size)} color={getColor(variant)}>
			SLRR MODS
		</Title>
	);

	if (asAnchor) {
		return <Link href="/">{titleComponent}</Link>;
	}

	return titleComponent;
}
