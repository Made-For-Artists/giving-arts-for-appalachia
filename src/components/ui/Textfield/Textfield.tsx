import { TextField } from "@kobalte/core/text-field";
import type { ValidationState } from "@kobalte/utils";
import type { ComponentProps } from "solid-js";
import "./Textfield.css";

interface Props extends ComponentProps<"input"> {
	label: string;
	errorMessage?: string;
	validationState?: ValidationState;
	textarea?: boolean;
}

export function Textfield(props: Props) {
	return (
		<TextField
			required={props.required}
			name={props.name}
			validationState={props.validationState}
			class="text-field"
		>
			<TextField.Label class="text-field__label">{props.label}</TextField.Label>
			{props.textarea ? (
				<TextField.TextArea class="text-field__input" />
			) : (
				<TextField.Input class="text-field__input" />
			)}
			<TextField.ErrorMessage class="text-field__error-message">
				{props.errorMessage || `${props.label} cannot be empty.`}
			</TextField.ErrorMessage>
		</TextField>
	);
}
