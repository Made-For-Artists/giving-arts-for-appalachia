import { RiArrowsArrowLeftLine, RiArrowsArrowRightLine } from 'solid-icons/ri';
import { createSignal, } from 'solid-js';
import { SquareIconButton } from '~/components/ui/Button.tsx';
import { PageHeading, PageSection } from '~/components/ui/PageSection.tsx';
import { fetchRecentlyAddedArtworks } from '~/firebase/client.ts';
import type { Artwork } from '~/lib/client.types.ts';
import ArtworkCard from './ArtworkCard.tsx';

export const MEASURED_ITEM_ID = 'measured-li';
export const GAP = 16; // gap-4
const HEADING_ID = 'artwork-carousel-heading';

interface Props {
	heading: string;
}

export default function ArtworkCarousel(props: Props) {
	let list: HTMLDivElement | undefined;
	const [scrollStatus, setScrollStatus] = createSignal<'start' | 'end' | 'middle'>('start');
    const [artworks, setArtworks] = createSignal<Artwork[]>([])

    fetchRecentlyAddedArtworks().then(arr => {
        console.log('recently added:', arr)
        setArtworks(arr)
    })

	const scroll = (delta: number) => {
		if (!list) return;

		const item = document.getElementById(MEASURED_ITEM_ID);
		const itemWidth = (item?.getBoundingClientRect().width ?? 300) + GAP;
		const containerWidth = list.getBoundingClientRect().width;
		const numCardsToScrollBy = Math.max(Math.floor(containerWidth / itemWidth), 1);

		list.scrollBy({
			left: numCardsToScrollBy * itemWidth * delta,
			behavior: 'smooth',
		});
	};

	return (
		<PageSection aria-labelledby={HEADING_ID}>
			<div class="flex items-center justify-between gap-2">
				<PageHeading id={HEADING_ID}>{props.heading}</PageHeading>
				<div class="flex gap-2">
					<SquareIconButton onClick={() => scroll(-1)} disabled={scrollStatus() === 'start'}>
						<RiArrowsArrowLeftLine />
						<span class="sr-only">Scroll left</span>
					</SquareIconButton>
					<SquareIconButton onClick={() => scroll(1)} disabled={scrollStatus() === 'end'}>
						<RiArrowsArrowRightLine />
						<span class="sr-only">Scroll right</span>
					</SquareIconButton>
				</div>
			</div>
			<div
				onScroll={() => {
					if (!list) return;
					const listWidth = list.getBoundingClientRect().width;
					setScrollStatus(() => {
						if (!list || list.scrollLeft <= 0) return 'start';
						if (Math.ceil(list.scrollLeft + listWidth) >= list.scrollWidth) return 'end';
						return 'middle';
					});
				}}
				class="snap-x snap-mandatory overflow-x-auto sm:snap-none"
				ref={list}
			>
				<ul class="flex w-max pb-4" style={{ gap: GAP + 'px' }}>
                    {
                        artworks().map((artwork, idx) => (
                            <li id={idx === 0 ? MEASURED_ITEM_ID : undefined} class="shrink-0 snap-start">
                                <ArtworkCard {...artwork} class="w-72" imageLoading={idx === 0 ? 'eager' : 'lazy'} />
                            </li>
                        ))
                    }
                </ul>
			</div>
		</PageSection>
	);
}
