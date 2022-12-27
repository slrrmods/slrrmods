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
import { checkEmailAvailable } from "../../endpoints/users";
import { validator } from "../../utils";
import ValidatedPasswordInput from "../ValidatedPasswordInput";

const formInitialValues = {
	email: "",
	username: "",
	password: "",
	confirmPassword: "",
	acceptTerms: false,
};

const formSchema = yup.object().shape({
	email: yup.string().required().email(),
	username: yup
		.string()
		.required()
		.min(3, "Username must have at least 3 characters"),
	password: yup
		.string()
		.required()
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
		.required()
		.oneOf([yup.ref("password")], "Passwords must match"),
	acceptTerms: yup
		.boolean()
		.required()
		.oneOf([true], "You must accept the terms and rules"),
});

export default function SignUpForm() {
	const [email, setEmail] = useDebouncedState("", 500);
	const [error, setError] = useState("");

	const router = useRouter();
	const isInModal = !!router.query.signUp;

	const focusTrapRef = useFocusTrap(isInModal);

	const form = useForm({
		initialValues: formInitialValues,
		validate: yupResolver(formSchema),
		validateInputOnBlur: true,
	});

	const canVerifyEmail = email.length > 0 && validator.validateEmail(email);
	const emailAvailableQuery = useQuery({
		queryKey: ["checkEmailAvailable", email],
		queryFn: () => checkEmailAvailable(email),
		retry: false,
		enabled: canVerifyEmail,
	});

	const handleSubmit = (values) => {
		console.log(values);
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

	const getEmailFiledError = () => {
		if (canVerifyEmail && emailAvailableQuery.isError)
			return "Email already in use";

		return form.getInputProps("email").error;
	};

	return (
		<form ref={focusTrapRef} onSubmit={form.onSubmit(handleSubmit)}>
			<Stack pt="md" spacing="xs">
				<TextInput
					label="Email"
					required
					data-autofocus
					autoComplete="email"
					{...form.getInputProps("email")}
					onChange={(event) => {
						setEmail(event.currentTarget.value);
						form.getInputProps("email").onChange(event);
					}}
					error={getEmailFiledError()}
					rightSection={
						<>
							{canVerifyEmail && emailAvailableQuery.isError && (
								<ThemeIcon variant="outline" radius="xl" color="red" size="sm">
									<IconX />
								</ThemeIcon>
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
					required
					autoComplete="username"
					{...form.getInputProps("username")}
				/>

				<ValidatedPasswordInput
					label="Password"
					required
					autoComplete="new-password"
					{...form.getInputProps("password")}
				/>

				<PasswordInput
					label="Confirm password"
					required
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
					{...form.getInputProps("acceptTerms", { type: "checkbox" })}
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
