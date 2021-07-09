import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
	const [user, setUser] = useState();

	const context = { user, setUser };

	return (
		<UserContext.Provider value={context}>{children}</UserContext.Provider>
	);
}

export function useUser() {
	return useContext(UserContext);
}
