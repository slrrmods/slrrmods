import { Link } from "@client/components";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";

export function UserPanel() {
	return <SignOptions />;
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
				as="/signin"
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
				as="/signup"
				shallow>
				<Button>Sign Up</Button>
			</Link>
		</Button.Group>
	);
}
