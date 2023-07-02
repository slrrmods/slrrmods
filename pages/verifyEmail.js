import { Button, Card, Center, Group, Stack, Text, Title } from "@mantine/core";
import { IconCircleCheck, IconInfoCircle, IconMail } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "../components/Link";
import { resendEmailVerification } from "../endpoints/users";
import { verifyEmail } from "../services/email-verification";

export default function VerifyEmail({ result, token }) {
	const router = useRouter();

	useEffect(() => {
		if (router.query.token)
			router.replace("/verifyEmail", undefined, { shallow: true });
	}, [router]);

	const isSuccess = result === "success";
	return (
		<Center>
			<Card
				withBorder
				shadow="md"
				style={{ minWidth: "350px", maxWidth: "450px", width: "100%" }}
				p={0}>
				<Stack bg={isSuccess ? "green" : "red"} p="md" c="white" spacing="sm">
					{isSuccess ? <Success /> : <Expired token={token} />}

					<Link href="/">
						<Button>Go to Home</Button>
					</Link>
				</Stack>
			</Card>
		</Center>
	);
}

function Success() {
	return (
		<Group align="center" noWrap>
			<IconCircleCheck style={{ width: "15%", height: "15%" }} />

			<Stack>
				<Title order={3}>Success!</Title>

				<Text>Email verified successfully.</Text>
			</Stack>
		</Group>
	);
}

function Expired({ token }) {
	const resendEmailMutation = useMutation({
		mutationFn: () => {
			return resendEmailVerification(token);
		},
		onSettled: () => {
			router.push("/");
		}
	});

	return (
		<>
			<Group noWrap align="center">
				<IconInfoCircle style={{ width: "20%", height: "20%" }} />

				<Stack>
					<Title order={3}>Email verification has expired</Title>

					<Text>
						Email verifications expires after 48 hours, but you can request a
						new one.
					</Text>
				</Stack>
			</Group>

			<Button
				leftIcon={<IconMail />}
				onClick={() => resendEmailMutation.mutate()}
				loading={resendEmailMutation.isLoading}>
				Resend verification email
			</Button>
		</>
	);
}

export async function getServerSideProps(context) {
	function redirectToMain() {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		};
	}

	function showResult(result, token = undefined) {
		return {
			props: {
				result,
				token
			}
		};
	}

	const { token } = context.query;
	if (!token) return redirectToMain();

	try {
		await verifyEmail(token);
	} catch (error) {
		if (error.message === "Token expired") return showResult("expired", token);
		return redirectToMain();
	}

	return showResult("success");
}
