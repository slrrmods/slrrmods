import { Modal, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { useUserContext } from "../../../contexts";
import { ForgotPasswordForm } from "../../Forms";

export default function ForgotPasswordModal() {
	const router = useRouter();
	const { user } = useUserContext();
	const opened = router.query.forgotPassword && !user;

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
