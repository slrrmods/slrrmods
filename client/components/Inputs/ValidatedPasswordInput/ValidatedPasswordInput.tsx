import { Box, PasswordInput, Popover, Progress, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ComponentPropsWithRef, useState } from "react";

export function ValidatedPasswordInput(
	props: ComponentPropsWithRef<typeof PasswordInput>
) {
	const [popoverOpened, setPopoverOpened] = useState(false);
	const [value, setValue] = useState("");
	const checks = requirements.map((requirement, index) => (
		<PasswordRequirement
			key={index}
			label={requirement.label}
			meets={requirement.re.test(value)}
		/>
	));

	const strength = getStrength(value);
	const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

	return (
		<Popover
			opened={popoverOpened}
			withinPortal
			arrowPosition="center"
			withArrow
			position="right-start"
			transitionProps={{
				transition: "pop",
			}}
			shadow="md">
			<Popover.Target>
				<div
					onFocusCapture={() => setPopoverOpened(true)}
					onBlurCapture={() => setPopoverOpened(false)}>
					<PasswordInput
						{...props}
						onChange={(event) => {
							setValue(event.currentTarget.value);
							if (props.onChange) props.onChange(event);
						}}
					/>
				</div>
			</Popover.Target>

			<Popover.Dropdown>
				<Progress
					color={color}
					value={strength}
					size={5}
					style={{ marginBottom: 10 }}
				/>

				<PasswordRequirement
					label="Includes at least 8 characters"
					meets={value.length >= 8}
				/>

				{checks}
			</Popover.Dropdown>
		</Popover>
	);
}

function PasswordRequirement({
	meets,
	label,
}: {
	meets: boolean;
	label: string;
}) {
	return (
		<Text
			color={meets ? "teal" : "red"}
			sx={{ display: "flex", alignItems: "center" }}
			mt={7}
			size="sm">
			{meets ? <IconCheck size={14} /> : <IconX size={14} />}{" "}
			<Box ml={10}>{label}</Box>
		</Text>
	);
}

const requirements = [
	{ re: /[0-9]/, label: "Includes number" },
	{ re: /[a-z]/, label: "Includes lowercase letter" },
	{ re: /[A-Z]/, label: "Includes uppercase letter" },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;

	requirements.forEach((requirement) => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}
