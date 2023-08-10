import { Link } from "@client/components";
import { signIn } from "@client/endpoints";
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
import { useForm, yupResolver } from "@mantine/form";
import { useFocusTrap, useLocalStorage } from "@mantine/hooks";
import { IconAlertCircle } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as yup from "yup";

const formInitialValues = {
	user: "",
	password: "",
};

const formSchema = yup.object().shape({
	user: yup.string().required("Email or username is required"),
	password: yup.string().required("Password is required"),
});

export function SignInForm() {
	const router = useRouter();
	const isInModal = !!router.query.signIn;

	const [remember, setRemember] = useLocalStorage({
		key: "remember-user",
		defaultValue: false,
	});

	const focusTrapRef = useFocusTrap(isInModal);

	const mutation = useMutation({
		mutationFn: ({ user, password }) => {
			return signIn(user, password, remember);
		},
		onSuccess: () => {},
	});

	const form = useForm({
		initialValues: formInitialValues,
		validate: yupResolver(formSchema),
	});

	return (
		<Stack pt="md" spacing="xs" ref={focusTrapRef}>
			<form
				onSubmit={form.onSubmit(mutation.mutate)}
				style={{ position: "relative" }}>
				<LoadingOverlay
					visible={mutation.isLoading}
					overlayBlur={2}
					transitionDuration={200}
					zIndex={5}
				/>

				<Stack spacing="xs">
					<TextInput
						label="Email or username"
						disabled={mutation.isLoading}
						autoComplete="email"
						withAsterisk
						data-autofocus
						{...form.getInputProps("user")}
					/>

					<PasswordInput
						label="Password"
						disabled={mutation.isLoading}
						autoComplete="current-password"
						withAsterisk
						{...form.getInputProps("password")}
					/>

					{mutation.isError && (
						<Alert
							title="Error"
							color="red"
							variant="filled"
							withCloseButton
							onClose={() => mutation.reset()}
							icon={<IconAlertCircle />}>
							{mutation.error.error}
						</Alert>
					)}

					<Group position="apart">
						<Checkbox
							label="Remember me"
							checked={remember}
							onChange={() => setRemember((v) => !v)}
							disabled={mutation.isLoading}
						/>

						<ForgotPasswordLink />
					</Group>

					<Button type="submit">{"Sign in"}</Button>
				</Stack>
			</form>

			<Divider />

			<SignUpLink />
		</Stack>
	);
}

function ForgotPasswordLink() {
	const router = useRouter();
	const isInModal = !!router.query.signIn;

	if (!isInModal)
		return (
			<Link href="/forgotpasasword">
				<ForgotPasswordAnchor />
			</Link>
		);

	return (
		<Link
			href={{
				pathname: router.pathname,
				query: {
					forgotPasasword: true,
				},
			}}
			as="/forgotpasasword"
			shallow>
			<ForgotPasswordAnchor />
		</Link>
	);
}

function ForgotPasswordAnchor({ ...props }) {
	return (
		<Anchor color="dimmed" size="xs" {...props}>
			{"Forgot password?"}
		</Anchor>
	);
}

function SignUpLink() {
	const router = useRouter();
	const isInModal = !!router.query.signIn;

	if (!isInModal)
		return (
			<Link href="/signup">
				<SignUpAnchor />
			</Link>
		);

	return (
		<Link
			href={{
				pathname: router.pathname,
				query: {
					signUp: true,
				},
			}}
			as="/signup"
			shallow>
			<SignUpAnchor />
		</Link>
	);
}

function SignUpAnchor({ ...props }) {
	return (
		<Anchor color="dimmed" size="xs" align="center" {...props}>
			{"Dont have an account? Sign up"}
		</Anchor>
	);
}
