import {
	Alert,
	Anchor,
	Button,
	Checkbox,
	Divider,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import CustomPasswordInput from "../CustomPasswordInput";

export default function SignUpForm() {
	const [error, setError] = useState("");
	const router = useRouter();

	const isInModal = !!router.query.signUp;

	const focusTrapRef = useFocusTrap(isInModal);

	const navigateToSignIn = () => {
		if (!isInModal) {
			router.push("/user/signin");
			return;
		}

		router.push(
			{
				pathname: router.pathname,
				query: { signIn: true },
			},
			"/user/signin",
			{ shallow: true }
		);
	};

	const clearError = () => {
		setError("");
	};

	return (
		<form ref={focusTrapRef}>
			<Stack pt="md" spacing="xs">
				<TextInput label="Email" required data-autofocus autoComplete="email" />

				<TextInput label="Username" required autoComplete="username" />

				<CustomPasswordInput
					label="Password"
					required
					autoComplete="new-password"
				/>

				<PasswordInput
					label="Confirm password"
					required
					autoComplete="confirm-password"
				/>

				<Checkbox
					label={
						<>
							{"I accept the "}
							<Link href="/rules" passHref>
								<Anchor component="a" target="_blank">
									terms and rules
								</Anchor>
							</Link>
						</>
					}
				/>

				{error && (
					<Alert
						title="Error"
						color="red"
						variant="filled"
						withCloseButton
						onClose={clearError}
						icon={<IconAlertCircle />}>
						{error}
					</Alert>
				)}

				<Button type="submit">Sign Up</Button>

				<Divider />

				<Anchor
					component="button"
					type="button"
					color="dimmed"
					size="xs"
					onClick={navigateToSignIn}>
					{"Already have an account? Sign in"}
				</Anchor>
			</Stack>
		</form>
	);
}
