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
import { IconAlertCircle } from "@tabler/icons-react";
import * as yup from "yup";
import { signIn } from "../../../endpoints/users";
import { useUserContext } from "../../../contexts";

const formInitialValues = {
	user: "",
	password: "",
};

const formSchema = yup.object().shape({
	user: yup.string().required("Email or username is required"),
	password: yup.string().required("Password is required"),
});

export default function SignInForm() {
	const userContext = useUserContext();
	const router = useRouter();
	const [remember, setRemember] = useLocalStorage({
		key: "remember-user",
		defaultValue: false,
	});

	const isInModal = !!router.query.signIn;
	const focusTrapRef = useFocusTrap(isInModal);

	const {
		mutate: trySignIn,
		reset,
		isLoading,
		error,
	} = useMutation({
		mutationFn: ({ user, password }) => {
			return signIn(user, password, remember);
		},
		onSuccess: ({ refreshToken }) => {
			userContext.signIn(refreshToken);
			close();
		},
	});

	const form = useForm({
		initialValues: formInitialValues,
		validate: yupResolver(formSchema),
	});

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
		trySignIn(values);
	}

	function close() {
		if (isInModal) router.push(router.pathname, undefined, { shallow: true });
		else router.push("/");
	}

	if (userContext.user) return <></>;

	return (
		<Stack pt="md" spacing="xs" ref={focusTrapRef}>
			<form
				onSubmit={form.onSubmit(handleSubmit)}
				style={{ position: "relative" }}>
				<LoadingOverlay
					visible={isLoading}
					overlayBlur={2}
					transitionDuration={200}
					zIndex={5}
				/>

				<Stack spacing="xs">
					<TextInput
						label="Email or username"
						disabled={isLoading}
						autoComplete="email"
						withAsterisk
						data-autofocus
						{...form.getInputProps("user")}
					/>

					<PasswordInput
						disabled={isLoading}
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
							onClose={() => reset()}
							icon={<IconAlertCircle />}>
							{error.message}
						</Alert>
					)}

					<Group position="apart">
						<Checkbox
							disabled={isLoading}
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

					<Button type="submit" loading={isLoading}>
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
