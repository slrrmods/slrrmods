import { NavButton } from "@client/components";
import { Group } from "@mantine/core";
import { useRouter } from "next/router";

const tabs = [
	{
		path: "/",
		title: "Home",
	},
	{
		path: "/news",
		title: "News",
	},
	{
		path: "/downloads",
		title: "Downloads",
	},
	{
		path: "/forum",
		title: "Forum",
	},
	{
		path: "/roleplay",
		title: "Roleplay",
	},
	{
		path: "/about",
		title: "About",
	},
];

export function NavBar() {
	const router = useRouter();

	return (
		<Group spacing={0}>
			{tabs.map((tab) => {
				return (
					<NavButton
						key={tab.path}
						href={tab.path}
						selected={router.asPath === tab.path}>
						{tab.title}
					</NavButton>
				);
			})}
		</Group>
	);
}
