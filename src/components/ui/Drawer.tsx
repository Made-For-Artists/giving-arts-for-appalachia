import { Dialog } from '@kobalte/core/dialog';
import type { JSX } from 'solid-js/types/jsx.d.ts';

export function Drawer(props: {
	title: string;
	trigger?: JSX.Element;
	children: JSX.Element;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	return (
		<Dialog
			defaultOpen={props.defaultOpen}
			open={props.open}
			onOpenChange={props.onOpenChange}
			preventScroll={true}
		>
			<Dialog.Trigger>{props.trigger}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay class="fixed inset-0 ui-expanded:animate-in ui-expanded:fade-in ui-closed:animate-out ui-closed:fade-out" />
				<Dialog.Content class="fixed inset-y-0 top-[120px] left-0 right-0 flex w-100vw flex-col bg-white ease-out ui-expanded:animate-in ui-expanded:fade-in ui-expanded:slide-in-from-top-4 ui-closed:animate-out ui-closed:fade-out ui-closed:slide-out-to-top-4">
                    <div class="border-b border-gray-300"></div>
					<main class="flex-1 overflow-y-auto px-6">{props.children}</main>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog>
	);
}
