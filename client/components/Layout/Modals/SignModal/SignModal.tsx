import { SignInForm, SignUpForm } from "@client/components";
import { Modal, Tabs } from "@mantine/core";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

type QueryParams = ParsedUrlQuery & {
	signIn: boolean;
	signUp: boolean;
};

export function SignModal() {
	const router = useRouter();
	const { signIn, signUp } = router.query as QueryParams;
	const isOpened = signIn || signUp;
	const selectedTab = getSelectedTab();

	function getSelectedTab() {
		if (signIn) return "signIn";
		if (signUp) return "signUp";
		return "";
	}

	function onClose() {
		router.push(router.pathname, undefined, { shallow: true });
	}

	function onTabChange(value: string) {
		router.push(
			{
				pathname: router.pathname,
				query: { [value]: true },
			},
			`/${value.toLowerCase()}`,
			{ shallow: true }
		);
	}

	return (
		<Modal opened={isOpened} onClose={onClose} title={"Welcome to SLRR Mods"}>
			<Tabs
				defaultValue={selectedTab}
				value={selectedTab}
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
