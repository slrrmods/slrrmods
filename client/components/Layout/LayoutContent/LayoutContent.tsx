import { Container } from "@mantine/core";

type LayoutContentProps = {} & React.ComponentPropsWithoutRef<typeof Container>;

export function LayoutContent(props: LayoutContentProps) {
	return <Container size="xl" p="md" {...props} />;
}
