import { Dialog } from '@kobalte/core/dialog';
import { RiSystemCloseFill } from 'solid-icons/ri';
import type { JSX } from 'solid-js/types/jsx.d.ts';
import './Dialog.css';
import type { JSXElement } from 'solid-js';

export function DialogComponent(props: {
	trigger?: JSX.Element;
	defaultOpen?: boolean;
	open?: boolean;
    title: string;
    description: string;
    children?: JSXElement;
	onOpenChange: (open: boolean) => void;
}) {
	return (
        <>
            <Dialog
                defaultOpen={props.defaultOpen}
                open={props.open}
                onOpenChange={props.onOpenChange}
                preventScroll={true}
            >
                <Dialog.Trigger class="dialog__trigger">{props.trigger}</Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay class="dialog__overlay" />
                    <div class="dialog__positioner">
                        <Dialog.Content class="dialog__content prose prose-gafacolors">
                            <div class="dialog__header">
                                <Dialog.Title class="dialog__title m-0">{props.title}</Dialog.Title>
                                <Dialog.CloseButton class="dialog__close-button">
                                    <RiSystemCloseFill size={24} />
                                </Dialog.CloseButton>
                            </div>
                            <Dialog.Description class="dialog__description">{props.description}</Dialog.Description>
                            {props.children}
                        </Dialog.Content>
                    </div>
                </Dialog.Portal>
            </Dialog>
        </>
	);
}
