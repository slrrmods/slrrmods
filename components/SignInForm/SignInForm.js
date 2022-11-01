import { useState } from "react";
import { useFocusTrap, useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/router";
import {
	Alert,
	Anchor,
	Button,
	Checkbox,
	Divider,
	Group,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

export default function SignInForm() {
	const [error, setError] = useState("");
	const router = useRouter();
	const [remember, setRemember] = useLocalStorage({
		key: "remember-user",
		defaultValue: false,
	});

	const isInModal = !!router.query.signIn;

	const focusTrapRef = useFocusTrap(isInModal);

	const toggleRemember = () => {
		setRemember((remember) => !remember);
	};

	const navigateToForgotPassword = () => {};

	const navigateToSignUp = () => {
		if (!isInModal) {
			router.push("/user/signup");
			return;
		}

		router.push(
			{
				pathname: router.pathname,
				query: { signUp: true },
			},
			"/user/signup",
			{ shallow: true }
		);
	};

	const clearError = () => {
		setError("");
	};

	return (
		<form ref={focusTrapRef}>
			<Stack pt="md">
				<TextInput
					label="Email or username"
					required
					data-autofocus
					autoComplete="email"
				/>

				<PasswordInput
					label="Password"
					required
					autoComplete="current-password"
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

				<Group position="apart">
					<Checkbox
						checked={remember}
						onChange={toggleRemember}
						label="Remember me"
					/>

					<Anchor
						component="button"
						type="button"
						size="sm"
						onClick={navigateToForgotPassword}>
						{"Forgot password?"}
					</Anchor>
				</Group>

				<Button type="submit">Sign In</Button>

				<Divider />

				<Anchor
					component="button"
					type="button"
					color="dimmed"
					size="xs"
					onClick={navigateToSignUp}>
					{"Don't have an account? Sign up"}
				</Anchor>
			</Stack>
		</form>
	);
}
