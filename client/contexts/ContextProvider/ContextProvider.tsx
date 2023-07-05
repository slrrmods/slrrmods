import { MantineProvider } from "@mantine/core";

export type ContextProviderProps = {
	children: React.ReactNode;
};

export function ContextProvider({ children }: ContextProviderProps) {
	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: "light"
			}}>
			{children}
		</MantineProvider>
	);
}
