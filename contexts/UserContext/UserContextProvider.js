import { useInterval, useLocalStorage } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { UserContext } from ".";
import { getIdentity, signIn, signOff } from "../../endpoints/users";
import { REFRESH_TOKEN_KEY, USER_KEY } from "../../utils/constants";

export default function UserContextProvider({ children, currentUser }) {
	const router = useRouter();
	const [user, setUser, removeUser] = useUserStorage(currentUser);
	const [refreshToken, setRefreshToken, removeRefreshToken] =
		useRefreshTokenStorage();

	const updateInterval = useUpdateInterval(onUpdate);

	const signOffMutation = useMutation({
		mutationFn: () => {
			if (user) signOff();
		},
		onSettled: () => {
			removeUser();
			removeRefreshToken();
		}
	});

	const signInMutation = useMutation({
		mutationFn: ({ username, password, sso }) =>
			signIn(username, password, sso),
		onSuccess: ({ userInfo, sessionInfo }) => {
			setUser(userInfo);
			setRefreshToken(refreshToken);
		},
		onError: () => signOff()
	});

	//todo: this must be a query
	const { mutate: update } = useMutation({
		mutationFn: () => getIdentity(),
		onSuccess: (data) => setStorageUser(data),
		onError: () => signOff()
	});

	useEffect(() => {
		onMounted();

		return onUnmounted;
	}, []);

	function onMounted() {
		updateCurrentUser();
	}

	function onUnmounted() {}

	function onUpdate() {
		updateCurrentUser();
	}

	function updateCurrentUser() {
		if (currentUser) update();
	}

	const context = {
		signIn: signInMutation.mutate,
		signOff: signOffMutation.mutate,
		user,
		loading: signInMutation.isLoading || signOffMutation.isLoading
	};

	return (
		<UserContext.Provider value={context}>{children}</UserContext.Provider>
	);
}

function useUserStorage(currentUser) {
	const [user, setUser] = useState(currentUser);
	const [storage, setStorage, removeStorage] = useLocalStorage({
		key: USER_KEY,
		defaultValue: undefined
	});

	const storageLoadedRef = useRef(false);
	if (storage) storageLoadedRef.current = true;
	const storageLoaded = storageLoadedRef.current;

	useEffect(() => {
		if (!storageLoaded) return;

		setUser(storage);
	}, [storage, storageLoaded]);

	useEffect(() => {
		deleteCookie(USER_KEY);

		if (!user) return;

		const cookieInfos = {
			id: storageUser.id,
			username: storageUser.username,
			profilePicture: storageUser.profilePicture
		};

		const cookieOptions = {
			maxAge: 60 * 60 * 24 * 30
		};

		setCookie(USER_KEY, cookieInfos, cookieOptions);
	}, [user]);

	function removeUser() {
		setStorage(undefined);
		removeStorage();
	}

	return [user, setStorage, removeUser];
}

function useRefreshTokenStorage() {
	const [refreshToken, setRefreshToken] = useState(undefined);
	const [storage, setStorage, removeStorage] = useLocalStorage({
		key: REFRESH_TOKEN_KEY,
		defaultValue: undefined
	});

	const storageLoadedRef = useRef(false);
	if (storage) storageLoadedRef.current = true;
	const storageLoaded = storageLoadedRef.current;

	useEffect(() => {
		if (storageLoaded) setRefreshToken(storage);
	}, [storage, storageLoaded]);

	function removeRefreshToken() {
		setStorage(undefined);
		removeStorage();
	}

	return [refreshToken, setStorage, removeRefreshToken];
}

function useUpdateInterval(onUpdate) {
	const updateInterval = useInterval(onUpdate, 1000 * 60 * 5);

	useEffect(() => {
		updateInterval.start();

		return updateInterval.stop;
	}, []);

	return updateInterval;
}
