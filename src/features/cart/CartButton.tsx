import { RiSystemCloseFill, RiSystemMenuLine } from 'solid-icons/ri';
import { type ComponentProps } from 'solid-js';
import { SquareIconButton } from '~/components/ui/Button.tsx';
import type { StrictOmit } from '~/lib/types.ts';
import { CartStore } from './store.ts';

export function CartButton(props: StrictOmit<ComponentProps<typeof SquareIconButton>, 'children'>) {
	return (
		<div class="relative">
			<SquareIconButton {...props}>
                {CartStore.drawerOpen ? <RiSystemCloseFill size={24} /> : <RiSystemMenuLine size={24} />}
				<span class="sr-only">Show navigation drawer</span>
			</SquareIconButton>
		</div>
	);
}
