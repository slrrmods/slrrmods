import { SignInForm } from "@client/components";
import { Card, Center, Title } from "@mantine/core";

export default function SignIn() {
	return (
		<Center>
			<Card withBorder shadow="md" w={"25rem"}>
				<Card.Section withBorder p="xs">
					<Title order={3}>Sign In</Title>
				</Card.Section>

				<SignInForm />
			</Card>
		</Center>
	);
}
