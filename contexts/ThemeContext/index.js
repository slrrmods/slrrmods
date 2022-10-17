import { createContext, useContext } from "react";
import ThemeContextProvider from "./ThemeContextProvider";

export const ThemeContext = createContext();
export const ThemeProvider = ThemeContextProvider;

export const useThemeContext = () => {
	return useContext(ThemeContext);
};
