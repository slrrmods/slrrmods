import { useState } from "react";
import { useRouter } from "next/router";
import { useFocusTrap, useLocalStorage } from "@mantine/hooks";
import { useForm } from "@mantine/form";
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
	const router = useRouter();

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const [remember, setRemember] = useLocalStorage({
		key: "remember-user",
		defaultValue: false,
	});

	const form = useForm({
		initialValues: {
			user: "",
			password: "",
		},
	});

	const isInModal = !!router.query.signIn;

	const focusTrapRef = useFocusTrap(isInModal);

	function toggleRemember() {
		setRemember((remember) => !remember);
	}

	function navigateToForgotPassword() {}

	function navigateToSignUp() {
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
	}

	function clearError() {
		setError("");
	}

	function signIn({ user, password }) {
		const values = { user, password, remember };

		setLoading(true);

		try {
			console.log(values);
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={form.onSubmit(signIn)} ref={focusTrapRef}>
			<Stack pt="md">
				<TextInput
					label="Email or username"
					required
					data-autofocus
					autoComplete="email"
					{...form.getInputProps("user")}
				/>

				<PasswordInput
					label="Password"
					required
					autoComplete="current-password"
					{...form.getInputProps("password")}
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

				<Button type="submit" loading={loading}>
					Sign In
				</Button>

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
