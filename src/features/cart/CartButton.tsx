import { RiSystemMenuLine } from 'solid-icons/ri';
import { type ComponentProps } from 'solid-js';
import { SquareIconButton } from '~/components/ui/Button.tsx';
import type { StrictOmit } from '~/lib/types.ts';

export function CartButton(props: StrictOmit<ComponentProps<typeof SquareIconButton>, 'children'>) {
	return (
		<div class="relative">
			<SquareIconButton {...props}>
				<RiSystemMenuLine />
				<span class="sr-only">Show navigation drawer</span>
			</SquareIconButton>
		</div>
	);
}
