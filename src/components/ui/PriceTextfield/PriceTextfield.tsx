import { NumberField } from "@kobalte/core/number-field";
import type { ComponentProps } from "solid-js";
import "./PriceTextfield.css";

interface Props extends ComponentProps<"input"> {
	label: string;
}

export function PriceTextfield(props: Props) {
	return (
		<NumberField
			formatOptions={{ style: "currency", currency: "USD" }}
			class="number-field"
		>
			<NumberField.Label class="number-field__label">
				{props.label}
			</NumberField.Label>
			<div class="number-field__group">
				<NumberField.Input
					required={props.required}
					name={props.name}
					class="number-field__input"
				/>
			</div>
		</NumberField>
	);
}
