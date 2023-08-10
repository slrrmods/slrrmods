import { createContext, useContext } from "react";

export type UserProviderProps = {
	children: React.ReactNode;
};

export type UserContextProps = {};

const DEFAULT_CONTEXT: UserContextProps = {};

const UserContext = createContext<UserContextProps>(DEFAULT_CONTEXT);

export function useUserContext() {
	return useContext(UserContext);
}

export function UserProvider({ children }: UserProviderProps) {
	const context = {};

	return (
		<UserContext.Provider value={context}>{children}</UserContext.Provider>
	);
}
