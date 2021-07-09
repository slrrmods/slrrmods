import React, { createContext, useContext, useState } from "react";

const DrawerContext = createContext();

export function DrawerProvider({ children }) {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const openDrawer = () => {
		setDrawerOpen(true);
	};

	const closeDrawer = () => {
		setDrawerOpen(false);
	};

	const context = { drawerOpen, openDrawer, closeDrawer };

	return (
		<DrawerContext.Provider value={context}>{children}</DrawerContext.Provider>
	);
}

export function useDrawer() {
	return useContext(DrawerContext);
}
