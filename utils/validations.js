import * as yup from "yup";

export const emailValidation = yup
	.string()
	.required("Email is required")
	.min(3, "Email must have at least 3 characters")
	.max(64, "Email must have at most 64 characters")
	.email("Email is not valid");

export const usernameValidation = yup
	.string()
	.required("Username is required")
	.min(3, "Username must have at least 3 characters")
	.max(32, "Username must have at most 32 characters")
	.matches(
		"^[a-zA-Z0-9_]+$",
		"Username must contain only letters, numbers and underscores"
	);

export const passwordValidation = yup
	.string()
	.required("Password is required")
	.min(8, "Password must have at least 8 characters")
	.matches("[0-9]", "Password must contain at least one number")
	.matches("[a-z]", "Password must contain at least one lowercase letter")
	.matches("[A-Z]", "Password must contain at least one uppercase letter")
	.matches(
		"[ !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]",
		"Password must contain at least one special character"
	);

export const confirmPasswordValidation = yup
	.string()
	.required("Confirm passworrd is requied")
	.oneOf([yup.ref("password")], "Passwords must match");

export const emailTokenValidation = yup.string().required("Token is required");
