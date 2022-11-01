import { Modal, Tabs, Title } from "@mantine/core";
import { useRouter } from "next/router";
import SignInForm from "../SignInForm";
import SignUpForm from "../SignUpForm";

export default function SignForm() {
	const router = useRouter();
	const { signIn, signUp } = router.query;
	const opened = signIn || signUp;
	const currentTab = getCurrentTab();

	function getCurrentTab() {
		if (signIn) return "signIn";
		if (signUp) return "signUp";
		return "";
	}

	const onClose = () => {
		router.push(router.pathname, undefined, { shallow: true });
	};

	const onTabChange = (value) => {
		router.push(
			{
				pathname: router.pathname,
				query: { [value]: true },
			},
			`/user/${value.toLowerCase()}`,
			{ shallow: true }
		);
	};

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
