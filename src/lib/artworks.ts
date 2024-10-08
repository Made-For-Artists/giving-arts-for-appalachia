import { type Artwork, getArtworks } from 'storefront:client';

export async function joinWithArtworks<T extends { artworkId: string }>(
    items: T[],
): Promise<Array<T & { artwork: Artwork }>> {
    const artworksResponse = await getArtworks({
        query: { ids: items.map((item) => item.artworkId) },
    });

    if (!artworksResponse.data) throw new Error('Failed to fetch artwork.');

    return items
        .map((item) => {
            const artwork = artworksResponse.data.items.find((artwork) => artwork.id === item.artworkId);
            // Filter out items that don't have a corresponding artwork.
            // This can happen if a artwork is deleted from the catalog.
            if (!artwork) return undefined;
            return { ...item, artwork };
        })
        .filter((item): item is T & { artwork: Artwork } => item !== undefined);
}
