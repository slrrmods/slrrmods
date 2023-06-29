import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, yupResolver } from "@mantine/form";
import {
	Button,
	Center,
	Stack,
	Title,
	Text,
	Card,
	PasswordInput,
	LoadingOverlay,
	Group,
} from "@mantine/core";
import { IconCircleCheck, IconInfoCircle } from "@tabler/icons-react";
import * as yup from "yup";
import { validateToken } from "../services/reset-password";
import { ValidatedPasswordInput } from "../components/Inputs";
import {
	passwordValidation,
	confirmPasswordValidation,
} from "../utils/validations";
import { resetPassword } from "../endpoints/users";
import { useRouter } from "next/router";
import Link from "../components/Link";

const formSchema = yup.object().shape({
	password: passwordValidation,
	confirmPassword: confirmPasswordValidation,
});

const STATES = {
	RESETING: 0,
	SUCCESS: 1,
	ERROR: 2,
};

export default function ResetPassword({ result, token }) {
	const router = useRouter();

	useEffect(() => {
		if (router.query.token)
			router.replace("/resetPassword", undefined, { shallow: true });
	}, [router]);

	const canReset = result === "reset";
	return <Center>{canReset ? <Reset token={token} /> : <Expired />}</Center>;
}

function Reset({ token }) {
	const [state, setState] = useState(STATES.RESETING);

	const form = useForm({
		initialValues: {
			password: "",
			confirmPassword: "",
		},
		validate: yupResolver(formSchema),
	});

	const resetPasswordMutation = useMutation({
		mutationFn: ({ password }) => {
			return resetPassword(token, password);
		},
		onSuccess: () => {
			setState(STATES.SUCCESS);
		},
		onError: () => {
			setState(STATES.ERROR);
		},
	});

	const loading = resetPasswordMutation.isLoading;

	function handleSubmit(values) {
		resetPasswordMutation.mutate(values);
	}

	return (
		<Card
			withBorder
			shadow="md"
			style={{
				minWidth: "350px",
				maxWidth: "450px",
				width: "100%",
				overflow: "visible",
			}}
			p={0}>
			{state === STATES.RESETING && (
				<>
					<Card.Section withBorder p="xs">
						<Title order={3}>Reset Password</Title>
					</Card.Section>

					<form
						onSubmit={form.onSubmit(handleSubmit)}
						style={{ position: "relative" }}>
						<Stack spacing="xs" p="md">
							<LoadingOverlay
								visible={loading}
								overlayBlur={2}
								transitionDuration={200}
								zIndex={5}
							/>

							<ValidatedPasswordInput
								label="New Password"
								disabled={loading}
								autoComplete="new-password"
								withAsterisk
								{...form.getInputProps("password")}
							/>

							<PasswordInput
								label="Confirm Password"
								disabled={loading}
								autoComplete="confirm-password"
								withAsterisk
								{...form.getInputProps("confirmPassword")}
							/>

							<Button type="submit" loading={loading}>
								Reset Password
							</Button>
						</Stack>
					</form>
				</>
			)}

			{state === STATES.SUCCESS && (
				<Stack bg="green" p="md" c="white">
					<Group align="center">
						<IconCircleCheck style={{ width: "15%", height: "15%" }} />

						<Stack>
							<Title order={3}>Success!</Title>
							<Text>Password reset successfully!</Text>
						</Stack>
					</Group>

					<Link href="/users/signIn">
						<Button>Sign In</Button>
					</Link>
				</Stack>
			)}

			{state === STATES.ERROR && (
				<Stack bg="red" p="md" c="white">
					<Group align="center">
						<IconInfoCircle style={{ width: "15%", height: "15%" }} />

						<Stack>
							<Title order={3}>Someting went wrong</Title>
							<Text>Unable to reset your password.</Text>
						</Stack>
					</Group>

					<Link href="/users/forgotPassword">
						<Button>Try again</Button>
					</Link>
				</Stack>
			)}
		</Card>
	);
}

function Expired() {
	return (
		<Card
			withBorder
			shadow="md"
			style={{ minWidth: "350px", maxWidth: "450px", width: "100%" }}
			p={0}>
			<Stack pt="md" bg="red" p="md" c="white">
				<Group noWrap align="center">
					<IconInfoCircle style={{ width: "20%", height: "20%" }} />

					<Stack>
						<Title order={3}>Password recovery expired</Title>

						<Text>
							Password recovery requests expires after 24 hours, but you can
							request a new one.
						</Text>
					</Stack>
				</Group>

				<Link href="/users/forgotPassword">
					<Button>Request New</Button>
				</Link>
			</Stack>
		</Card>
	);
}

export async function getServerSideProps(context) {
	function redirectToMain() {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	function showResult(result, token = undefined) {
		return {
			props: {
				result,
				token,
			},
		};
	}

	const { token } = context.query;
	if (!token) return redirectToMain();

	try {
		await validateToken(token);
	} catch (error) {
		if (error.message === "Token expired") return showResult("expired");
		return redirectToMain();
	}

	return showResult("reset", token);
}
