import type { DocumentSnapshot } from "firebase-admin/firestore";
import { createSignal } from "solid-js";
import Card from '~/components/ui/Card.tsx';
import { ArtworkImageCarousel } from '~/features/artwork/ArtworkImageCarousel.tsx';
import { ArtworkImageSwitcher } from '~/features/artwork/ArtworkImageSwitcher.tsx';
import { ArtworkPrice } from '~/features/artwork/ArtworkPrice.tsx';
import { attachDocListener } from "~/firebase/client.ts";
import type { Artwork } from '~/lib/client.types.ts';
import { MessageDialogButton } from "../ui/MessageDialog/MessageDialogButton.tsx";

interface Props {
    id: string;
}

export default function ArtworkDetails(props: Props) {
	const [artwork, setArtwork] = createSignal<Artwork>();
	const [artworkImages, setArtworkImages] = createSignal<string[]>([]);
    
    if (props.id) {
        attachDocListener(`artworks/${props.id}`, (doc: DocumentSnapshot) => {
            let curData = doc.data()
            console.log('artwork:', curData)
            curData.id = props.id
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
                        <div>
                            <p class="text-slate-700">{artwork()?.artist}</p>
                            <p class="text-slate-700 capitalize">{artwork()?.medium}</p>
                            <p class="text-slate-700">{artwork()?.dimensions}</p>
                        </div>
                        <p class="text-slate-700">{artwork()?.tagline}</p>
                        <p class="text-xl text-slate-700 md:text-2xl mt-8">
                            <ArtworkPrice class="gap-3 font-semibold" purchased={artwork()?.purchased} price={artwork()?.formattedPrice} />
                        </p>
                        <MessageDialogButton artworkID={artwork()?.id}></MessageDialogButton>
                    </header>
                </div>
            </div>
		</>
	);
}
