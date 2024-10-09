import type { QuerySnapshot } from 'firebase/firestore';
import { createSignal } from "solid-js";
import { For } from "solid-js";
import ArtworkCard from '~/features/artwork/ArtworkCard.tsx';
import { attachFirestoreCollectionListener } from '~/firebase/client.ts';
import type { Artwork } from '~/lib/client.types.ts';

export default function ArtworkCollection({ collection }) {
	const [artworks, setArtworks] = createSignal<Artwork[]>([]);

    if (collection === 'all') {
        attachFirestoreCollectionListener('artworks', (snapshot: QuerySnapshot) => {
            const arr : Artwork[] = [];
            snapshot.forEach((doc) => {
                let curData = doc.data()
                curData.id = doc.id
                arr.push(curData as Artwork);
            });
            console.log('artworks:', arr)
            setArtworks(arr)
        });
    } else {
        attachFirestoreCollectionListener('artworks', (snapshot: QuerySnapshot) => {
            const arr : Artwork[] = [];
            snapshot.forEach((doc) => {
                arr.push(doc.data() as Artwork);
            });
            console.log('artworks:', arr)
            setArtworks(arr)
        }, collection);
    }

	return (
		<>
            <For each={artworks()}>
                {(artwork) => (
                    <ArtworkCard {...artwork} />
                )}
            </For>
		</>
	);
}
