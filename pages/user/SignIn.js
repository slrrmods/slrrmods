import { Card, Center, Title } from "@mantine/core";
import SingInForm from "../../components/SignInForm";

export default function SignIn() {
	return (
		<Center>
			<Card withBorder shadow="md" style={{ width: "30%" }}>
				<Card.Section withBorder p="xs">
					<Title order={3}>Sign In</Title>
				</Card.Section>

				<SingInForm />
			</Card>
		</Center>
	);
}
