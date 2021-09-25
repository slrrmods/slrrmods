import { Stack, Paper, Container } from "@material-ui/core";

export default function LoginPage() {
	return (
		<Container>
			<Stack
				direction="column"
				justifyContent="center"
				alignItems="center"
				spacing={3}>
				<Paper>Logo</Paper>

				<Paper>Login</Paper>

				<Paper>Create account</Paper>
			</Stack>
		</Container>
	);
}
