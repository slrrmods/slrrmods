import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
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
import { signIn } from "../../../endpoints/users";

const formSchema = yup.object().shape({
	user: yup.string().required("Email or username is required"),
	password: yup.string().required("Password is required"),
});

export default function SignInForm() {
	const router = useRouter();

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

	const signInMutation = useMutation({
		mutationFn: ({ user, password }) => {
			return signIn(user, password, remember);
		},
		onSuccess: () => {
			close();
		},
	});

	const loading = signInMutation.isLoading;
	const error = signInMutation.error;

	function navigateToForgotPassword() {
		if (!isInModal) {
			router.push("/users/forgotPassword");
			return;
		}

		router.push(
			{
				pathname: router.pathname,
				query: { forgotPassword: true },
			},
			"/users/forgotPassword",
			{ shallow: true }
		);
	}

	function navigateToSignUp() {
		if (!isInModal) {
			router.push("/users/signUp");
			return;
		}

		router.push(
			{
				pathname: router.pathname,
				query: { signUp: true },
			},
			"/users/signUp",
			{ shallow: true }
		);
	}

	function handleSubmit(values) {
		signInMutation.mutate(values);
	}

	function close() {
		if (isInModal) router.push(router.pathname, undefined, { shallow: true });
		else router.push("/");
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
							onClose={() => signInMutation.reset()}
							icon={<IconAlertCircle />}>
							{error.message}
						</Alert>
					)}

					<Group position="apart">
						<Checkbox
							disabled={loading}
							checked={remember}
							onChange={() => setRemember((v) => !v)}
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
