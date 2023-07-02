import NextLink from "next/link";
import React, { forwardRef } from "react";

function Link(props, ref) {
	const {
		onMouseMove,
		onPointerDown,
		onPointerEnter,
		children,
		newTab,
		...linkProps
	} = props;

	const target = newTab ? "_blank" : "_self";

	return (
		<span
			ref={ref}
			onMouseMove={onMouseMove}
			onPointerDown={onPointerDown}
			onPointerEnter={onPointerEnter}>
			<NextLink {...linkProps} passHref legacyBehavior>
				{React.cloneElement(children, { target, component: "a" })}
			</NextLink>
		</span>
	);
}

export default forwardRef(Link);
