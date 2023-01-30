import { useRouter } from "next/router";
import { Modal, Title } from "@mantine/core";
import { ForgotPasswordForm } from "../../Forms";

export default function ForgotPasswordModal() {
	const router = useRouter();
	const opened = router.query.forgotPassword;

	function onClose() {
		router.push(router.pathname, undefined, { shallow: true });
	}

	return (
		<Modal
			transitionDuration={0}
			opened={opened}
			onClose={onClose}
			title={<Title order={4}>Forgot Password</Title>}>
			<ForgotPasswordForm />
		</Modal>
	);
}
