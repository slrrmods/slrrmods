import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type ContextProviderProps = {
	children: React.ReactNode;
};

const queryClient = new QueryClient();

export function ContextProvider({ children }: ContextProviderProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: "light",
				}}>
				{children}
			</MantineProvider>
		</QueryClientProvider>
	);
}
