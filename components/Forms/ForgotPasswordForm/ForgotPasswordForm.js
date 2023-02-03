import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useFocusTrap } from "@mantine/hooks";
import { useForm, yupResolver } from "@mantine/form";
import {
	Button,
	Group,
	LoadingOverlay,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";
import * as yup from "yup";
import { emailValidation } from "../../../utils/validations";
import { sendResetPassword } from "../../../endpoints/users";
import { useUserContext } from "../../../contexts";

const formSchema = yup.object().shape({
	email: emailValidation,
});

export default function ForgotPasswordForm() {
	const router = useRouter();
	const { user } = useUserContext();
	const [hasSent, setHasSent] = useState(false);
	const isInModal = !!router.query.forgotPassword;
	const focusTrapRef = useFocusTrap(isInModal);

	useEffect(() => {
		if (!isInModal) return;

		setTimeout(() => {
			const firstElement = document.querySelector("[data-autofocus]");
			if (firstElement) firstElement.focus();
		}, 10);
	}, [isInModal]);

	const form = useForm({
		initialValues: {
			email: "",
		},
		validate: yupResolver(formSchema),
	});

	const resetPasswordMutation = useMutation({
		mutationFn: ({ email }) => {
			return sendResetPassword(email);
		},
		onSettled: () => {
			setHasSent(true);
		},
	});

	const isLoading = resetPasswordMutation.isLoading;

	function handleSubmit(values) {
		resetPasswordMutation.mutate(values);
	}

	function reset() {
		form.reset();
		resetPasswordMutation.reset();
		setHasSent(false);
	}

	function close() {
		if (isInModal) router.push(router.pathname, undefined, { shallow: true });
		else router.push("/");
	}

	if (user) return <></>;

	if (hasSent)
		return (
			<Stack spacing="xs">
				<Text>
					If an account with that email exists, we have sent you an email with a
					link to reset your password.
				</Text>

				<Group position="apart">
					<Button variant="subtle" leftIcon={<IconArrowLeft />} onClick={reset}>
						Go Back
					</Button>

					<Button onClick={close}>{isInModal ? "Close" : "Go to Home"}</Button>
				</Group>
			</Stack>
		);

	return (
		<form
			ref={focusTrapRef}
			onSubmit={form.onSubmit(handleSubmit)}
			style={{ position: "relative" }}>
			<Stack spacing="xs">
				<LoadingOverlay
					visible={isLoading}
					overlayBlur={2}
					transitionDuration={200}
					zIndex={5}
				/>

				<TextInput
					label="Email"
					disabled={isLoading}
					autoComplete="email"
					withAsterisk
					data-autofocus
					{...form.getInputProps("email")}
				/>

				<Button type="submit" loading={isLoading}>
					Recover Password
				</Button>
			</Stack>
		</form>
	);
}
