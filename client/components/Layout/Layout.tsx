import { Header, Heads, LayoutContent } from "@/client/components";

type LayoutProps = {
	children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
	return (
		<>
			<Heads />

			<Header />

			<LayoutContent>{children}</LayoutContent>
			{/*

			<Footer />

			<Analitcs /> */}
		</>
	);
}
