import { Container } from "@mantine/core";

export type LayoutContentProps = {} & React.ComponentPropsWithoutRef<
	typeof Container
>;

export function LayoutContent({ children, ...props }: LayoutContentProps) {
	return (
		<Container size="xl" my="md" {...props}>
			<main style={{ display: "grid" }}>{children}</main>
		</Container>
	);
}
