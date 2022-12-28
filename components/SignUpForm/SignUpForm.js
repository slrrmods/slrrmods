import { useEffect, useState } from "react";
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
	PasswordInput,
	Stack,
	TextInput,
	ThemeIcon,
	Tooltip,
} from "@mantine/core";
import { useFocusTrap, useDebouncedState } from "@mantine/hooks";
import { useForm, yupResolver } from "@mantine/form";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons";
import * as yup from "yup";
import {
	checkEmailAvailable,
	checkUsernameAvailable,
} from "../../endpoints/users";
import { validator } from "../../utils";
import ValidatedPasswordInput from "../ValidatedPasswordInput";

const formInitialValues = {
	email: "",
	username: "",
	password: "",
	confirmPassword: "",
	acceptTerms: false,
};

export default function SignUpForm() {
	const [email, setEmail] = useDebouncedState("", 500);
	const [username, setUsername] = useDebouncedState("", 500);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const router = useRouter();
	const isInModal = !!router.query.signUp;

	const focusTrapRef = useFocusTrap(isInModal);

	const canVerifyEmail = email.length >= 3 && validator.validateEmail(email);
	const emailAvailableQuery = useQuery({
		queryKey: ["checkEmailAvailable", email],
		queryFn: () => checkEmailAvailable(email),
		retry: false,
		enabled: canVerifyEmail,
	});

	const canVerifyUsername = username.length >= 3;
	const usernameAvailableQuery = useQuery({
		queryKey: ["checkUsernameAvailable", username],
		queryFn: () => checkUsernameAvailable(username),
		retry: false,
		enabled: canVerifyUsername,
	});

	const formSchema = yup.object().shape({
		email: yup
			.string()
			.required("Email is required")
			.email("Email is not valid")
			.test("emailAvailable", "Email not available", (value) => {
				return emailAvailableQuery.status !== "error";
			}),
		username: yup
			.string()
			.required("Username is required")
			.min(3, "Username must have at least 3 characters")
			.test("usernameAvailable", "Username not available", (value) => {
				return usernameAvailableQuery.status !== "error";
			}),
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
		validateInputOnBlur: true,
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

	const handleSubmit = async (values) => {
		try {
			setLoading(true);

			await new Promise((resolve) => setTimeout(resolve, 3000));

			console.log(values);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

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
		<form ref={focusTrapRef} onSubmit={form.onSubmit(handleSubmit)}>
			<Stack pt="md" spacing="xs">
				<TextInput
					label="Email"
					withAsterisk
					data-autofocus
					autoComplete="email"
					{...form.getInputProps("email")}
					onChange={(event) => {
						setEmail(event.currentTarget.value);
						form.getInputProps("email").onChange(event);
					}}
					rightSection={
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
					}
				/>

				<TextInput
					label="Username"
					withAsterisk
					data-autofocus
					autoComplete="username"
					{...form.getInputProps("username")}
					onChange={(event) => {
						setUsername(event.currentTarget.value);
						form.getInputProps("username").onChange(event);
					}}
					rightSection={
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
					}
				/>

				<ValidatedPasswordInput
					label="Password"
					withAsterisk
					autoComplete="new-password"
					{...form.getInputProps("password")}
				/>

				<PasswordInput
					label="Confirm password"
					withAsterisk
					autoComplete="confirm-password"
					{...form.getInputProps("confirmPassword")}
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
