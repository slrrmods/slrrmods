import { Container } from "@mantine/core";

export type LayoutContentProps = {} & React.ComponentPropsWithoutRef<
	typeof Container
>;

export function LayoutContent(props: LayoutContentProps) {
	return <Container size="xl" my="md" {...props} />;
}
