import { Link } from "@client/components";
import { Button, ButtonProps } from "@mantine/core";
import { useStyles } from "./NavButton.styles";

export type NavButtonProps = {
	href: string;
	selected: boolean;
} & ButtonProps;

export function NavButton(props: NavButtonProps) {
	const { href, selected, ...rest } = props;
	const { classes } = useStyles();

	return (
		<Link href={href}>
			<Button disabled={selected} classNames={classes} {...rest} />
		</Link>
	);
}
