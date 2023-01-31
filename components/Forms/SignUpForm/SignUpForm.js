import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
	Alert,
	Anchor,
	Button,
	Checkbox,
	Divider,
	Loader,
	LoadingOverlay,
	PasswordInput,
	Stack,
	TextInput,
	ThemeIcon,
	Tooltip,
} from "@mantine/core";
import { useFocusTrap, useDebouncedValue } from "@mantine/hooks";
import { useForm, yupResolver } from "@mantine/form";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons";
import { ValidatedPasswordInput } from "../../Inputs";
import * as yup from "yup";
import * as users from "../../../endpoints/users";
import {
	emailValidation,
	usernameValidation,
	passwordValidation,
	confirmPasswordValidation,
} from "../../../utils/validations";
import { useUserContext } from "../../../contexts/UserContext";
import Link from "../../Link";

const formInitialValues = {
	email: "",
	username: "",
	password: "",
	confirmPassword: "",
	acceptTerms: false,
};

export default function SignUpForm() {
	const [email, setEmail] = useState("");
	const [debouncedEmail] = useDebouncedValue(email, 500);
	const isDebouncingEmail = email !== debouncedEmail;

	const [username, setUsername] = useState("");
	const [debouncedUsername] = useDebouncedValue(username, 500);
	const isDebouncingUsername = username !== debouncedUsername;

	const router = useRouter();
	const isInModal = !!router.query.signUp;

	const focusTrapRef = useFocusTrap(isInModal);

	const canVerifyEmail =
		!isDebouncingEmail && emailValidation.isValidSync(debouncedEmail);
	const emailAvailableQuery = useQuery({
		queryKey: ["checkEmailAvailable", debouncedEmail],
		queryFn: () => users.checkEmailAvailable(debouncedEmail),
		retry: false,
		enabled: canVerifyEmail,
		refetchOnWindowFocus: false,
	});

	const canVerifyUsername =
		!isDebouncingUsername && usernameValidation.isValidSync(debouncedUsername);
	const usernameAvailableQuery = useQuery({
		queryKey: ["checkUsernameAvailable", debouncedUsername],
		queryFn: () => users.checkUsernameAvailable(debouncedUsername),
		retry: false,
		enabled: canVerifyUsername,
		refetchOnWindowFocus: false,
	});

	const userContext = useUserContext();
	const signInMutation = useMutation({
		mutationFn: async ({ username, password }) => {
			await users.signIn(username, password, true);
			userContext.signIn();
		},
		onSettled: () => {
			close();
		},
	});

	const signUpMutation = useMutation({
		mutationFn: async ({ email, username, password }) => {
			await users.signUp(email, username, password);
			return {
				username,
				password,
			};
		},
		onSuccess: (data) => {
			signInMutation.mutate(data);
		},
	});

	const loading = signUpMutation.isLoading || signInMutation.isLoading;
	const error = signUpMutation.error;

	const formSchema = yup.object().shape({
		email: emailValidation.test("emailAvailable", "Email not available", () => {
			return emailAvailableQuery.status !== "error";
		}),
		username: usernameValidation.test(
			"usernameAvailable",
			"Username not available",
			() => {
				return usernameAvailableQuery.status !== "error";
			}
		),
		password: passwordValidation,
		confirmPassword: confirmPasswordValidation,
		acceptTerms: yup
			.boolean()
			.required()
			.oneOf([true], "You must accept the terms and rules"),
	});

	const form = useForm({
		initialValues: formInitialValues,
		validate: yupResolver(formSchema),
	});

	const emailError = form.errors.email;
	if (emailAvailableQuery.status === "error") {
		if (!emailError) form.setFieldError("email", "Email not available");
	} else {
		if (emailError === "Email not available") form.clearFieldError("email");
	}

	const usernameError = form.errors.username;
	if (usernameAvailableQuery.status === "error") {
		if (!usernameError)
			form.setFieldError("username", "Username not available");
	} else {
		if (usernameError === "Username not available")
			form.clearFieldError("username");
	}

	function close() {
		if (isInModal) router.push(router.pathname, undefined, { shallow: true });
		else router.push("/");
	}

	function navigateToSignIn() {
		if (!isInModal) {
			router.push("/users/signIn");
			return;
		}

		router.push(
			{
				pathname: router.pathname,
				query: { signIn: true },
			},
			"/users/signIn",
			{ shallow: true }
		);
	}

	function handleSubmit(values) {
		if (isDebouncingEmail || isDebouncingUsername) return;

		if (emailAvailableQuery.isLoading || usernameAvailableQuery.isLoading)
			return;

		signUpMutation.mutate(values);
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
						label="Email"
						value={email}
						disabled={loading}
						autoComplete="email"
						withAsterisk
						data-autofocus
						{...form.getInputProps("email")}
						onChange={(event) => {
							setEmail(event.currentTarget.value);
							form.getInputProps("email").onChange(event);
						}}
						rightSection={
							!loading && (
								<>
									{canVerifyEmail && emailAvailableQuery.isError && (
										<Tooltip label="Email not available">
											<ThemeIcon
												variant="outline"
												radius="xl"
												color="red"
												size="sm">
												<IconX />
											</ThemeIcon>
										</Tooltip>
									)}

									{canVerifyEmail && emailAvailableQuery.isLoading && (
										<Loader size="xs" />
									)}

									{canVerifyEmail && emailAvailableQuery.isSuccess && (
										<Tooltip label="Email available">
											<ThemeIcon
												variant="outline"
												radius="xl"
												color="teal"
												size="sm">
												<IconCheck />
											</ThemeIcon>
										</Tooltip>
									)}
								</>
							)
						}
					/>

					<TextInput
						label="Username"
						value={username}
						disabled={loading}
						autoComplete="username"
						withAsterisk
						{...form.getInputProps("username")}
						onChange={(event) => {
							setUsername(event.currentTarget.value);
							form.getInputProps("username").onChange(event);
						}}
						rightSection={
							!loading && (
								<>
									{canVerifyUsername && usernameAvailableQuery.isError && (
										<Tooltip label="Username not available">
											<ThemeIcon
												variant="outline"
												radius="xl"
												color="red"
												size="sm">
												<IconX />
											</ThemeIcon>
										</Tooltip>
									)}

									{canVerifyUsername && usernameAvailableQuery.isLoading && (
										<Loader size="xs" />
									)}

									{canVerifyUsername && usernameAvailableQuery.isSuccess && (
										<Tooltip label="Username available">
											<ThemeIcon
												variant="outline"
												radius="xl"
												color="teal"
												size="sm">
												<IconCheck />
											</ThemeIcon>
										</Tooltip>
									)}
								</>
							)
						}
					/>

					<ValidatedPasswordInput
						label="Password"
						disabled={loading}
						autoComplete="new-password"
						withAsterisk
						{...form.getInputProps("password")}
					/>

					<PasswordInput
						label="Confirm password"
						disabled={loading}
						autoComplete="confirm-password"
						withAsterisk
						{...form.getInputProps("confirmPassword")}
					/>

					<Checkbox
						disabled={loading}
						label={
							<>
								{"I accept the "}
								<Link href="/rules" newTab>
									<Anchor>terms and rules</Anchor>
								</Link>
							</>
						}
						{...form.getInputProps("acceptTerms")}
					/>

					<Button type="submit" loading={loading}>
						Sign Up
					</Button>

					{error && (
						<Alert
							title="Error"
							color="red"
							variant="filled"
							withCloseButton
							onClose={() => signUpMutation.reset()}
							icon={<IconAlertCircle />}>
							{error.message}
						</Alert>
					)}
				</Stack>
			</form>

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
	);
}
