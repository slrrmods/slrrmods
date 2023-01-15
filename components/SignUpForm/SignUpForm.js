import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
import * as yup from "yup";
import {
	checkEmailAvailable,
	checkUsernameAvailable,
} from "../../endpoints/users";
import ValidatedPasswordInput from "../ValidatedPasswordInput";

const formInitialValues = {
	email: "",
	username: "",
	password: "",
	confirmPassword: "",
	acceptTerms: false,
};

const emailValidation = yup
	.string()
	.required("Email is required")
	.min(3, "Email must have at least 3 characters")
	.max(64, "Email must have at most 64 characters")
	.email("Email is not valid");

const usernameValidation = yup
	.string()
	.required("Username is required")
	.min(3, "Username must have at least 3 characters")
	.max(32, "Username must have at most 32 characters")
	.matches(
		"^[a-zA-Z0-9_]+$",
		"Username must contain only letters, numbers and underscores"
	);

export default function SignUpForm() {
	const [email, setEmail] = useState("");
	const [debouncedEmail] = useDebouncedValue(email, 500);
	const isDebouncingEmail = email !== debouncedEmail;

	const [username, setUsername] = useState("");
	const [debouncedUsername] = useDebouncedValue(username, 500);
	const isDebouncingUsername = username !== debouncedUsername;

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const router = useRouter();
	const isInModal = !!router.query.signUp;

	const focusTrapRef = useFocusTrap(isInModal);

	const canVerifyEmail =
		!isDebouncingEmail && emailValidation.isValidSync(debouncedEmail);

	const emailAvailableQuery = useQuery({
		queryKey: ["checkEmailAvailable", debouncedEmail],
		queryFn: () => checkEmailAvailable(debouncedEmail),
		retry: false,
		enabled: canVerifyEmail,
		refetchOnWindowFocus: false,
	});

	const canVerifyUsername =
		!isDebouncingUsername && usernameValidation.isValidSync(debouncedUsername);

	const usernameAvailableQuery = useQuery({
		queryKey: ["checkUsernameAvailable", debouncedUsername],
		queryFn: () => checkUsernameAvailable(debouncedUsername),
		retry: false,
		enabled: canVerifyUsername,
		refetchOnWindowFocus: false,
	});

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
		password: yup
			.string()
			.required("Password is required")
			.min(8, "Password must have at least 8 characters")
			.matches("[0-9]", "Password must contain at least one number")
			.matches("[a-z]", "Password must contain at least one lowercase letter")
			.matches("[A-Z]", "Password must contain at least one uppercase letter")
			.matches(
				"[ !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]",
				"Password must contain at least one special character"
			),
		confirmPassword: yup
			.string()
			.required("Confirm passworrd is requied")
			.oneOf([yup.ref("password")], "Passwords must match"),
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

	function navigateToSignIn() {
		if (!isInModal) {
			router.push("/user/signIn");
			return;
		}

		router.push(
			{
				pathname: router.pathname,
				query: { signIn: true },
			},
			"/user/signIn",
			{ shallow: true }
		);
	}

	function clearError() {
		setError("");
	}

	async function handleSubmit(values) {
		if (isDebouncingEmail || isDebouncingUsername) return;

		if (emailAvailableQuery.isLoading || usernameAvailableQuery.isLoading)
			return;

		try {
			setLoading(true);

			await new Promise((resolve) => setTimeout(resolve, 3000));

			console.log(values);
		} catch (error) {
			setError(error.message);
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
								<Link href="/rules" passHref legacyBehavior>
									<Anchor component="a" target="_blank">
										terms and rules
									</Anchor>
								</Link>
							</>
						}
						{...form.getInputProps("acceptTerms")}
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

					<Button type="submit" loading={loading}>
						Sign Up
					</Button>
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
