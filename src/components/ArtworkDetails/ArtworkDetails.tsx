import type { DocumentSnapshot } from "firebase-admin/firestore";
import { createSignal } from "solid-js";
import Card from '~/components/ui/Card.tsx';
import { ArtworkImageCarousel } from '~/features/artwork/ArtworkImageCarousel.tsx';
import { ArtworkImageSwitcher } from '~/features/artwork/ArtworkImageSwitcher.tsx';
import { ArtworkPrice } from '~/features/artwork/ArtworkPrice.tsx';
import { attachDocListener } from "~/firebase/client.ts";
import type { Artwork } from '~/lib/client.types.ts';

export default function ArtworkDetails({ id }) {
	const [artwork, setArtwork] = createSignal<Artwork>();
	const [artworkImages, setArtworkImages] = createSignal<string[]>([]);
    
    if (id) {
        attachDocListener(`artworks/${id}`, (doc: DocumentSnapshot) => {
            let curData = doc.data()
            console.log('artwork:', curData)
            setArtwork(curData as Artwork)
            setArtworkImages(curData.images)
        });
    }
	
    return (
		<>
            <div class="mx-auto mb-16 mt-8 grid max-w-lg grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-[1fr_32rem] lg:gap-32">
                <div>
                    {
                        artworkImages.length > 1 ? (
                            <>
                                <div class="-mx-4 -mt-8 md:m-0 lg:hidden">
                                    <ArtworkImageCarousel artworkImages={artworkImages()} />
                                </div>
                                <div class="hidden lg:block">
                                    <ArtworkImageSwitcher artworkImages={artworkImages()} />
                                </div>
                            </>
                        ) : (
                            <Card class="aspect-square justify-center">
                                <img src={artworkImages()[0]} alt={artwork()?.title} class="object-cover" />
                            </Card>
                        )
                    }
                </div>

                <div class="mt-4">
                    <header class="mb-8 flex flex-col items-start gap-3">
                        <h1 class="text-pretty text-3xl font-bold md:text-4xl">
                            {artwork()?.title}
                        </h1>
                        {artwork()?.tagline && <p class="text-slate-700">{artwork()?.tagline}</p>}
                        <p class="text-xl text-slate-700 md:text-2xl">
                            <ArtworkPrice class="gap-3 font-semibold" price={artwork()?.price} />
                        </p>
                    </header>
                </div>
            </div>
		</>
	);
}
