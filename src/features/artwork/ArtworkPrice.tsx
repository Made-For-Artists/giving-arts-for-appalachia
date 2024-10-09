import { twMerge } from 'tailwind-merge';
import type { Artwork } from '~/lib/client.types.ts';

type Props = {
	price?: Artwork['price'];
	class?: string;
};

export function ArtworkPrice(props: Props) {
	return (
		<span class={twMerge('flex gap-2 font-medium', props.class)}>
			{props.price}
		</span>
	);
}
