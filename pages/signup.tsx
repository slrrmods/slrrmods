import { SignUpForm } from "@client/components";
import { Card, Center, Title } from "@mantine/core";

export default function SignUp() {
	return (
		<Center>
			<Card withBorder shadow="md" w={"25rem"}>
				<Card.Section withBorder p="xs">
					<Title order={3}>Sign Up</Title>
				</Card.Section>

				<SignUpForm />
			</Card>
		</Center>
	);
}
