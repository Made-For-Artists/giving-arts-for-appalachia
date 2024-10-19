import type { QuerySnapshot } from 'firebase/firestore';
import { createSignal } from "solid-js";
import { For } from "solid-js";
import ArtworkCard from '~/features/artwork/ArtworkCard.tsx';
import { attachFirestoreCollectionListener } from '~/firebase/client.ts';
import type { Artwork } from '~/lib/client.types.ts';

interface Props {
    collection: string;
    sort?: string;
    order?: string;
}

export default function ArtworkCollection({ collection, sort, order } : Props) {
	const [artworks, setArtworks] = createSignal<Artwork[]>([]);

    if (collection === 'all') {
        attachFirestoreCollectionListener('artworks', (snapshot: QuerySnapshot) => {
            // Firestore response
            const arr : Artwork[] = [];
            snapshot.forEach((doc) => {
                let curData = doc.data()
                curData.id = doc.id
                arr.push(curData as Artwork);
            });

            setArtworks(organizeData(sort, order, arr))
        });
    } else {
        attachFirestoreCollectionListener('artworks', (snapshot: QuerySnapshot) => {
            const arr : Artwork[] = [];
            snapshot.forEach((doc) => {
                arr.push(doc.data() as Artwork);
            });

            setArtworks(organizeData(sort, order, arr))
        }, collection);
    }

    const organizeData = (sortProp?: string, orderProp?: string, arr?: Artwork[]) => {
        if (!arr) return []
        
        if (sortProp === 'price') {
			return arr.sort((a, b) => {
				return orderProp === 'asc' ? a.price - b.price : b.price - a.price;
			});
		} else if (sortProp === 'title') {
			return arr.sort((a, b) => {
				return orderProp === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
			});
		} else {
            return arr
        }
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
