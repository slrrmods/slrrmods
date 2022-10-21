import { useStyles } from "./Navbar.styles";
import { Tabs, Button } from "@mantine/core";
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

export default function Navbar() {
	const { classes } = useStyles();

	const router = useRouter();
	const rootPath = router.asPath.split("/")[1];
	const currentPath = `/${rootPath}`;

	const onTabChange = (value) => {
		router.push(`/${value}`);
	};

	return (
		<Tabs
			value={currentPath}
			onTabChange={onTabChange}
			classNames={{
				tabsList: classes.tabsList,
				tab: classes.tab,
			}}>
			<Tabs.List grow>
				{tabs.map((t) => {
					return (
						<Tabs.Tab key={t.path} value={t.path}>
							{t.title}
						</Tabs.Tab>
					);
				})}
			</Tabs.List>
		</Tabs>
	);
}
