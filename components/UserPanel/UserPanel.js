import { Button } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UserPanel() {
	const user = false;

	const router = useRouter();

	return (
		<>
			{user && <div>tem usuario</div>}

			{!user && (
				<Button.Group>
					<Link
						href={{
							pathname: router.pathname,
							query: {
								signIn: true,
							},
						}}
						as="/user/signIn"
						passHref
						shallow>
						<Button component="a" variant="filled">
							Sign In
						</Button>
					</Link>

					<Link
						href={{
							pathname: router.pathname,
							query: {
								signUp: true,
							},
						}}
						as="/user/signUp"
						passHref
						shallow>
						<Button component="a" variant="filled">
							Sign Up
						</Button>
					</Link>
				</Button.Group>
			)}
		</>
	);
}
