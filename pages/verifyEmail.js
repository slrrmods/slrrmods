import { useRouter } from "next/router";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Button, Center, Stack, Title, Text } from "@mantine/core";
import { IconMail } from "@tabler/icons";
import { resendEmailVerification } from "../endpoints/users";
import { validateToken } from "../services/email-verification";

function Success() {
	return (
		<>
			<Title>Email verified successfully</Title>

			<Text color="dimmed" size="lg">
				Thank you for verifying your email.
			</Text>
		</>
	);
}

function Expired() {
	const router = useRouter();
	const { token } = router.query;

	const resendEmailMutation = useMutation({
		mutationFn: () => {
			return resendEmailVerification(token);
		},
		onSettled: () => {
			router.push("/");
		},
	});

	return (
		<>
			<Title>Your email verification has expired</Title>

			<Text color="dimmed" size="lg">
				Email verifications expires after 48 hours, but you can request a new
				one.
			</Text>

			<Button
				size="lg"
				leftIcon={<IconMail />}
				onClick={() => resendEmailMutation.mutate()}
				loading={resendEmailMutation.isLoading}>
				Resend verification email
			</Button>
		</>
	);
}

export default function VerifyEmail({ result }) {
	const isSuccess = result === "success";

	return (
		<Center>
			<Stack align="center">
				{isSuccess ? <Success /> : <Expired />}

				<Link href="/" passHref legacyBehavior>
					<Button component="a" variant="subtle" size="md">
						Take me back to home page
					</Button>
				</Link>
			</Stack>
		</Center>
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

	function showResult(result) {
		return {
			props: {
				result,
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

	return showResult("success");
}
