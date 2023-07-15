import { ThemeProvider, ThemeProviderProps } from "@client/contexts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type ContextProviderProps = {
	children: React.ReactNode;
} & ThemeProviderProps;

const queryClient = new QueryClient();

export function ContextProvider(props: ContextProviderProps) {
	const { children, currentTheme } = props;

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider currentTheme={currentTheme}>{children}</ThemeProvider>
		</QueryClientProvider>
	);
}
