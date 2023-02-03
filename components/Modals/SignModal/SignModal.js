import { useRouter } from "next/router";
import { Modal, Tabs, Title } from "@mantine/core";
import { SignInForm, SignUpForm } from "../../Forms";
import { useUserContext } from "../../../contexts";

export default function SignModal() {
	const router = useRouter();
	const { user } = useUserContext();
	const { signIn, signUp } = router.query;
	const opened = (signIn || signUp) && !user;
	const currentTab = getCurrentTab();

	function getCurrentTab() {
		if (signIn) return "signIn";
		if (signUp) return "signUp";
		return "";
	}

	function onClose() {
		router.push(router.pathname, undefined, { shallow: true });
	}

	function onTabChange(value) {
		router.push(
			{
				pathname: router.pathname,
				query: { [value]: true },
			},
			`/users/${value}`,
			{ shallow: true }
		);
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={<Title order={4}>Welcome to SLRR Mods</Title>}>
			<Tabs
				defaultValue={currentTab}
				value={currentTab}
				onTabChange={onTabChange}>
				<Tabs.List grow>
					<Tabs.Tab value="signIn">Sign In</Tabs.Tab>
					<Tabs.Tab value="signUp">Sign Up</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="signIn">
					<SignInForm />
				</Tabs.Panel>

				<Tabs.Panel value="signUp">
					<SignUpForm />
				</Tabs.Panel>
			</Tabs>
		</Modal>
	);
}
