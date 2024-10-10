
import type { Artwork } from 'storefront:client';
import { twMerge } from 'tailwind-merge';
import Card from '~/components/ui/Card.tsx';
import { artworkPath } from '~/paths.ts';
import { ArtworkPrice } from './ArtworkPrice.tsx';

interface Props extends Artwork {
	class?: string;
	elementId?: string | null;
	imageLoading?: 'eager' | 'lazy';
}

export default function ArtworkCard(props : Props) {
    return (
        <a
            href={artworkPath(props.id)}
            class={twMerge(`group relative block w-full focus-visible:ring-0`)}
            id={props.elementId ?? undefined}
            aria-label={`${props.title} for ${props.price}`}>
            <article>
                <Card class="flex aspect-[5/6] items-center justify-center">
                    <img
                        src={props.imageUrl}
                        alt={props.title}
                        width={290}
                        height={290}
                        loading={props.imageLoading ?? 'lazy'}
                        draggable="false"
                    />
                </Card>
                <div class="flex flex-col gap-2 p-2 font-medium">
                    <h3 class="text-pretty leading-tight text-theme-base-900">{props.title}</h3>
                    <p class="text-lg/tight text-theme-base-600">
                        <ArtworkPrice price={props.purchased ? 'GIFTED' : props.formattedPrice} />
                    </p>
                </div>
            </article>
            <div class="pointer-events-none absolute inset-0 ring-inset ring-theme-base-900 group-focus-visible:ring-2"></div>
        </a>
    )
}
