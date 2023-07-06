import NextLink from "next/link";
import React, { forwardRef } from "react";

type LinkProps = { newTab?: boolean } & React.ComponentProps<typeof NextLink>;

function RefLink(props: LinkProps, ref: React.LegacyRef<HTMLSpanElement>) {
	const {
		onMouseMove,
		onPointerDown,
		onPointerEnter,
		children,
		newTab,
		...linkProps
	} = props;

	return (
		<span
			ref={ref}
			onMouseMove={onMouseMove}
			onPointerDown={onPointerDown}
			onPointerEnter={onPointerEnter}>
			<NextLink {...linkProps} passHref legacyBehavior>
				{React.cloneElement(children as React.ReactElement<any>, {
					target: newTab ? "_blank" : "_self",
					component: "a",
				})}
			</NextLink>
		</span>
	);
}

export const Link = forwardRef<HTMLSpanElement, LinkProps>(RefLink);
