import { Select } from "@kobalte/core/select";
import "./Dropdown.css";
import { RiArrowsArrowDropDownLine, RiSystemCheckFill } from 'solid-icons/ri'
import type { ComponentProps } from "solid-js";

interface Props extends ComponentProps<"select"> {
	label: string;
	placeholder?: string;
    options: string[];
}

export function Dropdown(props: Props) {
  return (
    <Select
      name={props.name}
      options={props.options}
      placeholder={props.placeholder}
      itemComponent={props => (
        <Select.Item item={props.item} class="select__item">
          <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class="select__item-indicator">
            <RiSystemCheckFill />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Label class="select__label">{props.label}</Select.Label>
      <Select.HiddenSelect />
      <Select.Trigger class="select__trigger" aria-label={props.label}>
        <Select.Value class="select__value">
          {state => state.selectedOption()}
        </Select.Value>
        <Select.Icon class="select__icon">
          <RiArrowsArrowDropDownLine />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="select__content">
          <Select.Listbox class="select__listbox" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}