import { useState } from "react";
import { useRouter } from "next/router";
import { useFocusTrap, useLocalStorage } from "@mantine/hooks";
import { useForm, yupResolver } from "@mantine/form";
import {
	Alert,
	Anchor,
	Button,
	Checkbox,
	Divider,
	Group,
	LoadingOverlay,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import * as yup from "yup";

const formSchema = yup.object().shape({
	user: yup.string().required("Email or username is required"),
	password: yup.string().required("Password is required"),
});

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
		validate: yupResolver(formSchema),
	});

	const isInModal = !!router.query.signIn;

	const focusTrapRef = useFocusTrap(isInModal);

	function toggleRemember() {
		setRemember((remember) => !remember);
	}

	function navigateToForgotPassword() {}

	function navigateToSignUp() {
		if (!isInModal) {
			router.push("/user/signUp");
			return;
		}

		router.push(
			{
				pathname: router.pathname,
				query: { signUp: true },
			},
			"/user/signUp",
			{ shallow: true }
		);
	}

	function clearError() {
		setError("");
	}

	async function handleSubmit({ user, password }) {
		const values = { user, password, remember };

		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 3000));

			console.log(values);
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Stack pt="md" spacing="xs" ref={focusTrapRef}>
			<form
				onSubmit={form.onSubmit(handleSubmit)}
				style={{ position: "relative" }}>
				<LoadingOverlay
					visible={loading}
					overlayBlur={2}
					transitionDuration={200}
					zIndex={5}
				/>

				<Stack spacing="xs">
					<TextInput
						label="Email or username"
						disabled={loading}
						autoComplete="email"
						withAsterisk
						data-autofocus
						{...form.getInputProps("user")}
					/>

					<PasswordInput
						disabled={loading}
						label="Password"
						withAsterisk
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
							disabled={loading}
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
				</Stack>
			</form>

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
	);
}
