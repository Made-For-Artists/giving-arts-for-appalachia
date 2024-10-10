import { twMerge } from 'tailwind-merge';
import type { Artwork } from '~/lib/client.types.ts';

type Props = {
	price?: Artwork['formattedPrice'];
	class?: string;
    purchased?: boolean;
};

export function ArtworkPrice(props: Props) {
	return (
        <>
            <div class="flex gap-2">
                <span class={twMerge('flex gap-2 font-medium', props.class, (props.purchased && 'line-through'))}>
                    {props.price}
                </span>
                <span>{props.purchased ? 'GIFTED' : ''}</span>
            </div>
        </>
	);
}
