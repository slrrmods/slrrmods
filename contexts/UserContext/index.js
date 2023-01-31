import { createContext, useContext } from "react";
import UserContextProvider from "./UserContextProvider";

export const UserContext = createContext();
export const UserProvider = UserContextProvider;

export const useUserContext = () => {
	return useContext(UserContext);
};
