import type { Artwork } from "./lib/client.types.ts";

export const artworkPath = (slug: Artwork['slug']) => `/artworks/${slug}`;
