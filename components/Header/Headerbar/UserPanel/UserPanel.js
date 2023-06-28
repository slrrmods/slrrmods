import { Avatar, Button, Group, Loader, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useUserContext } from "../../../../contexts";
import Link from "../../../Link";

export default function UserPanel() {
	const { user, loading } = useUserContext();

	if (loading) return <Loader mx="md" size="sm" color="white" variant="dots" />;
	if (user) return <UserOptions />;
	return <SignOptions />;
}

function UserOptions() {
	const { user, signOff, loading } = useUserContext();

	return (
		<Group mx="xs" spacing="xs">
			<Button onClick={() => signOff()}>Sign Off</Button>
			<Text fw={700}>{user.username}</Text>
			<Avatar variant="filled" radius="xl" src={user.profilePicture} />
		</Group>
	);
}

function SignOptions() {
	const router = useRouter();

	return (
		<Button.Group>
			<Link
				href={{
					pathname: router.pathname,
					query: {
						signIn: true,
					},
				}}
				as="/users/signIn"
				shallow>
				<Button>Sign In</Button>
			</Link>

			<Link
				href={{
					pathname: router.pathname,
					query: {
						signUp: true,
					},
				}}
				as="/users/signUp"
				shallow>
				<Button>Sign Up</Button>
			</Link>
		</Button.Group>
	);
}
