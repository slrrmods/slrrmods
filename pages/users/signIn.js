import { Card, Center, Title } from "@mantine/core";
import { SignInForm } from "../../components/Forms";

export default function SignIn() {
	return (
		<Center>
			<Card
				withBorder
				shadow="md"
				style={{ minWidth: "350px", maxWidth: "450px", width: "100%" }}>
				<Card.Section withBorder p="xs">
					<Title order={3}>Sign In</Title>
				</Card.Section>

				<SignInForm />
			</Card>
		</Center>
	);
}
