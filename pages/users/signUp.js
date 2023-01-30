import { Card, Center, Title } from "@mantine/core";
import { SignUpForm } from "../../components/Forms";

export default function SignUp() {
	return (
		<Center>
			<Card
				withBorder
				shadow="md"
				style={{ minWidth: "350px", maxWidth: "450px", width: "100%" }}>
				<Card.Section withBorder p="xs">
					<Title order={3}>Sign Up</Title>
				</Card.Section>

				<SignUpForm />
			</Card>
		</Center>
	);
}
