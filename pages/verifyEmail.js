import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Button, Center, Stack, Title, Text } from "@mantine/core";
import { IconMail } from "@tabler/icons";
import { createClient } from "../services/supabase-client";
import { isBase64Valid } from "../utils/uuid";
import { resendEmailVerification } from "../endpoints/users";
import { useRouter } from "next/router";

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
	if (!isBase64Valid(token)) return redirectToMain();

	const client = createClient();
	const { data, error } = await client
		.from("users")
		.select("id, email_confirmation_sent_at")
		.eq("email_confirmation_token", token);

	if (error) return redirectToMain();
	if (data.length === 0) return redirectToMain();

	const user = data[0];

	const now = new Date();
	const sentAt = new Date(user.email_confirmation_sent_at);
	const diff = now.getTime() - sentAt.getTime();
	const diffHours = Math.floor(diff / (1000 * 60 * 60));

	if (diffHours > 48) return showResult("expired");

	await client
		.from("users")
		.update({
			email_confirmed_at: new Date(),
			email_confirmation_token: null,
			email_confirmation_sent_at: null,
		})
		.eq("id", user.id);

	return showResult("success");
}
