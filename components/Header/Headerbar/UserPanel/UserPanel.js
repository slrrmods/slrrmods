import { Button, Group, Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { useUserContext } from "../../../../contexts/UserContext";
import Link from "../../../Link";

export default function UserPanel() {
	const { user, signOff, loading } = useUserContext();

	const router = useRouter();

	if (loading) return <Loader color="white" variant="dots" />;

	if (user)
		return (
			<Group>
				<div>{user.username}</div>
				<Button onClick={() => signOff()}>sign off</Button>
			</Group>
		);

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
