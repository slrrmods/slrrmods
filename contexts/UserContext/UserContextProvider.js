import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { useInterval, useLocalStorage } from "@mantine/hooks";
import { deleteCookie, setCookie } from "cookies-next";
import { USER_COOKIE_KEY } from "../../utils/constants";
import { getIdentity, signOff as signOffUser } from "../../endpoints/users";
import { UserContext } from ".";

export default function UserContextProvider({ children, currentUser }) {
	const router = useRouter();
	const [user, setUser] = useState(currentUser);
	const [storageUser, setStorageUser, removeStorageUser] = useLocalStorage({
		key: USER_COOKIE_KEY,
		defaultValue: undefined,
	});
	const storageLoadedRef = useRef(false);
	if (storageUser) storageLoadedRef.current = true;
	const storageUserLoaded = storageLoadedRef.current;

	const { mutate: signOff, isLoading: isSignOffLoading } = useMutation({
		mutationFn: () => {
			if (user) signOffUser();
		},
		onSettled: () => {
			setStorageUser(undefined);
			removeStorageUser();
		},
	});

	const { mutate: signIn, isLoading: isSignInLoading } = useMutation({
		mutationFn: () => getIdentity(),
		onSuccess: (data) => setStorageUser(data),
		onError: () => signOff(),
	});

	const { mutate: update } = useMutation({
		mutationFn: () => getIdentity(),
		onSuccess: (data) => setStorageUser(data),
		onError: () => signOff(),
	});

	useEffect(() => {
		if (currentUser) update();
	}, []);

	useEffect(() => {
		if (storageUserLoaded) setUser(storageUser);
	}, [storageUser, storageUserLoaded]);

	useEffect(() => {
		deleteCookie(USER_COOKIE_KEY);

		if (!storageUser) return;

		const cookieInfos = {
			id: storageUser.id,
			username: storageUser.username,
			profilePicture: storageUser.profilePicture,
		};

		const cookieOptions = {
			maxAge: 60 * 60 * 24 * 30,
		};

		setCookie(USER_COOKIE_KEY, cookieInfos, cookieOptions);
	}, [storageUser]);

	const updateInterval = useInterval(update, 1000 * 60 * 5);

	useEffect(() => {
		updateInterval.start();
		return updateInterval.stop;
	}, []);

	const context = {
		signIn,
		signOff,
		user,
		loading: isSignInLoading || isSignOffLoading,
	};

	return (
		<UserContext.Provider value={context}>{children}</UserContext.Provider>
	);
}
