import { Button, Badge, Avatar, IconButton, Paper } from "@material-ui/core";
import Link from "next/link";

import { useUser } from "../../../contexts/UserContext";
import { useDrawer } from "../../../contexts/DrawerContext";

export default function UserInfo() {
	const { user } = useUser();
	const { openDrawer } = useDrawer();

	return (
		<>
			{user && (
				<IconButton onClick={openDrawer}>
					<Badge overlap="circular" badgeContent={2} color="error">
						<Avatar />
					</Badge>
				</IconButton>
			)}

			{!user && (
				<Link href="/login">
					<Button color="primary" variant="contained" disableElevation>
						Login
					</Button>
				</Link>
			)}
		</>
	);
}
