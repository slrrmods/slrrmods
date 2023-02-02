import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "@mantine/hooks";
import { deleteCookie, setCookie } from "cookies-next";
import { USER_COOKIE_KEY } from "../../utils/constants";
import { UserContext } from ".";
import { getUserInfo, signOff as signOffUser } from "../../endpoints/users";

export default function UserContextProvider({
	children,
	currentUser: cookieUser,
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(cookieUser);
	const loadedRef = useRef(false);
	const [storageUser, setStorageUser, removeStorageUser] = useLocalStorage({
		key: USER_COOKIE_KEY,
		defaultValue: undefined,
	});

	useEffect(() => {
		//todo: revalidate session
	}, []);

	useEffect(() => {
		if (cookieUser) setStorageUser(cookieUser);
	}, [cookieUser, setStorageUser]);

	useEffect(() => {
		if (storageUser) loadedRef.current = true;
		if (!loadedRef.current) return;

		setUser(storageUser);

		if (storageUser) {
			setCookie(USER_COOKIE_KEY, storageUser, {
				maxAge: 60 * 60 * 24 * 30,
			});
		} else deleteCookie(USER_COOKIE_KEY);
	}, [storageUser]);

	const getUserInfoMutation = useMutation({
		mutationFn: () => {
			//todo: get only necessary data
			return getUserInfo();
		},
		onSuccess: (data) => {
			setStorageUser({
				id: data.id,
				username: data.username,
				profilePicture: data.profilePicture,
			});
		},
		onMutate: () => setLoading(true),
		onSettled: () => setLoading(false),
	});

	const signOffMutation = useMutation({
		mutationFn: () => signOffUser(),
		onMutate: () => setLoading(true),
		onSettled: () => setLoading(false),
	});

	function signIn() {
		getUserInfoMutation.mutate();
	}

	function signOff() {
		setStorageUser(undefined);
		removeStorageUser();
		signOffMutation.mutate();
		deleteCookie(USER_COOKIE_KEY);
		router.push("/");
	}

	const context = {
		signIn,
		signOff,
		user,
		loading,
	};

	return (
		<UserContext.Provider value={context}>{children}</UserContext.Provider>
	);
}
