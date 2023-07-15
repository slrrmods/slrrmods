import NextLink from "next/link";
import React, { forwardRef } from "react";

export type LinkProps = {
	newTab?: boolean;
	children: React.ReactElement;
} & React.ComponentProps<typeof NextLink>;

function RefLink(props: LinkProps, ref: React.LegacyRef<HTMLSpanElement>) {
	const { children, newTab } = props;

	return (
		<NextLink {...props} passHref legacyBehavior>
			{React.cloneElement(children, {
				component: "a",
				target: newTab ? "_blank" : "_self",
				ref,
			})}
		</NextLink>
	);
}

export const Link = forwardRef<HTMLSpanElement, LinkProps>(RefLink);
