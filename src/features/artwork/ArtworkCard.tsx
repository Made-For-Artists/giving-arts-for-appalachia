
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
            class={twMerge(`group relative block focus-visible:ring-0`)}
            id={props.elementId ?? undefined}
            aria-label={`${props.title} for ${props.price}`}>
            <article class="flex flex-col h-full">
                <Card class="flex aspect-[5/6] items-center justify-center h-80">
                    <img
                        src={props.imageUrl}
                        alt={props.title}
                        width={290}
                        height={290}
                        loading={props.imageLoading ?? 'lazy'}
                        draggable="false"
                        class="object-contain h-full w-full"
                    />
                </Card>
                <div class="flex flex-col flex-1 p-2 font-medium prose">
                    <h3 class="m-0 text-pretty text-theme-base-900 italic">{props.title}</h3>
                    <p class="m-0 mt-auto leading-tight">{props.artist}</p>
                    <p class="m-0 leading-tight capitalize">{props.medium}</p>
                    <p class="m-0 leading-tight">{props.dimensions}</p>
                    <p class="text-lg/tight text-theme-base-600 m-0 mt-3">
                        <ArtworkPrice purchased={props.purchased} price={props.formattedPrice} />
                    </p>
                </div>
            </article>
            <div class="pointer-events-none absolute inset-0 ring-inset ring-theme-base-900 group-focus-visible:ring-2"></div>
        </a>
    )
}
