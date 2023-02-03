import { Card, Center, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { SignInForm } from "../../components/Forms";
import { useUserContext } from "../../contexts";

export default function SignIn() {
	const router = useRouter();
	const { user } = useUserContext();

	useEffect(() => {
		if (user) router.push("/");
	}, [user, router]);

	if (user) return <></>;

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
