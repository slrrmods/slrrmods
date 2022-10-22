import { Group, Button } from "@mantine/core";

export default function UserPanel() {
	const user = false;

	return (
		<>
			{user && <div>tem usuario</div>}

			{!user && (
				<Button.Group>
					<Button variant="filled">Log In</Button>

					<Button variant="filled">Sign Up</Button>
				</Button.Group>
			)}
		</>
	);
}
