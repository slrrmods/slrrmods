import { Card, Center, Title } from "@mantine/core";
import { ForgotPasswordForm } from "../../components/Forms";

export default function ForgotPassword() {
	return (
		<Center>
			<Card
				withBorder
				shadow="md"
				style={{ minWidth: "350px", maxWidth: "450px", width: "100%" }}>
				<Card.Section withBorder p="xs">
					<Title order={3}>Forgot Password</Title>
				</Card.Section>

				<ForgotPasswordForm />
			</Card>
		</Center>
	);
}
