import { Card, Center, Title } from "@mantine/core";
import SignUpForm from "../../components/SignUpForm";

export default function SignUp() {
	return (
		<Center>
			<Card withBorder shadow="md">
				<Card.Section withBorder p="xs">
					<Title order={3}>Sign Up</Title>
				</Card.Section>

				<SignUpForm />
			</Card>
		</Center>
	);
}
