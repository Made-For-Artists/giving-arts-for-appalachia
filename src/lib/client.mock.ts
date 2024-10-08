// This file contains mock functions for all storefront services.
// You can use this as a template to connect your own ecommerce provider.

import type { Options, RequestResult } from '@hey-api/client-fetch';
import type {
    Artwork,
    Collection,
    CreateCustomerData,
    CreateCustomerError,
    CreateCustomerResponse,
    CreateOrderData,
    CreateOrderError,
    CreateOrderResponse,
    GetArtworkByIdResponse,
    GetArtworksError,
    GetArtworksResponse,
    GetCollectionByIdData,
    GetCollectionByIdError,
    GetCollectionByIdResponse,
    GetCollectionsData,
    GetCollectionsError,
    GetCollectionsResponse,
    GetOrderByIdData,
    GetOrderByIdError,
    GetOrderByIdResponse,
    GetProductByIdData,
    GetProductByIdError,
    GetProductsData,
    Order
} from './client.types.ts';

export * from './client.types.ts';

export const getArtworks = <ThrowOnError extends boolean = false>(
    options?: Options<GetProductsData, ThrowOnError>,
): RequestResult<GetArtworksResponse, GetArtworksError, ThrowOnError> => {
    let items = Object.values(artworks);
    console.log('artworks:', items[0])
    if (options?.query?.collectionId) {
        const collectionId = options.query.collectionId;
        if (collectionId !== 'all') items = items.filter((product) => product.collectionIds?.includes(collectionId));
    }
    if (options?.query?.ids) {
        const ids = Array.isArray(options.query.ids) ? options.query.ids : [options.query.ids];
        items = items.filter((product) => ids.includes(product.id));
    }
    if (options?.query?.limit && options?.query?.recentlyAdded) {
        const { limit } = options.query;
        items = items.sort((a, b) => {
            return b.createdAt - a.createdAt
        }).slice(limit);
    }
    if (options?.query?.sort && options?.query?.order) {
        const { sort, order } = options.query;
        if (sort === 'price') {
            items = items.sort((a, b) => {
                return order === 'asc' ? a.price - b.price : b.price - a.price;
            });
        } else if (sort === 'name') {
            items = items.sort((a, b) => {
                return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            });
        }
    }
    return asResult({ items, next: null });
};

export const getArtworkById = <ThrowOnError extends boolean = false>(
    options: Options<GetProductByIdData, ThrowOnError>,
): RequestResult<GetArtworkByIdResponse, GetProductByIdError, ThrowOnError> => {
    const artwork = artworks[options.path.id];
    if (!artwork) {
        const error = asError<GetProductByIdError>({ error: 'not-found' });
        if (options.throwOnError) throw error;
        return error as RequestResult<GetArtworkByIdResponse, GetProductByIdError, ThrowOnError>;
    }
    return asResult(artwork);
};

export const getCollections = <ThrowOnError extends boolean = false>(
    _options?: Options<GetCollectionsData, ThrowOnError>,
): RequestResult<GetCollectionsResponse, GetCollectionsError, ThrowOnError> => {
    return asResult({ items: Object.values(collections), next: null });
};

export const getCollectionById = <ThrowOnError extends boolean = false>(
    options: Options<GetCollectionByIdData, ThrowOnError>,
): RequestResult<GetCollectionByIdResponse, GetCollectionByIdError, ThrowOnError> => {
    const collection = collections[options.path.id];
    if (!collection) {
        const error = asError<GetCollectionByIdError>({ error: 'not-found' });
        if (options.throwOnError) throw error;
        return error as RequestResult<GetCollectionByIdResponse, GetCollectionByIdError, ThrowOnError>;
    }
    return asResult({ ...collection, products: [] });
};

export const createCustomer = <ThrowOnError extends boolean = false>(
    options?: Options<CreateCustomerData, ThrowOnError>,
): RequestResult<CreateCustomerResponse, CreateCustomerError, ThrowOnError> => {
    if (!options?.body) throw new Error('No body provided');
    return asResult({
        ...options.body,
        id: options.body.id ?? 'customer-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
    });
};

const orders: Record<string, Order> = {};

export const createOrder = <ThrowOnError extends boolean = false>(
    options?: Options<CreateOrderData, ThrowOnError>,
): RequestResult<CreateOrderResponse, CreateOrderError, ThrowOnError> => {
    if (!options?.body) throw new Error('No body provided');
    const order: Order = {
        ...options.body,
        id: 'dk3fd0sak3d',
        number: 1001,
        lineItems: options.body.lineItems.map((lineItem) => ({
            ...lineItem,
            id: `line-item-${lineItem.productId}`,
        })),
        billingAddress: getAddress(options.body.billingAddress),
        shippingAddress: getAddress(options.body.shippingAddress),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
    };
    orders[order.id] = order;
    return asResult(order);
};

export const getOrderById = <ThrowOnError extends boolean = false>(
    options: Options<GetOrderByIdData, ThrowOnError>,
): RequestResult<GetOrderByIdResponse, GetOrderByIdError, ThrowOnError> => {
    const order = orders[options.path.id];
    if (!order) {
        const error = asError<GetOrderByIdError>({ error: 'not-found' });
        if (options.throwOnError) throw error;
        return error as RequestResult<GetOrderByIdResponse, GetOrderByIdError, ThrowOnError>;
    }
    return asResult(order);
};

import artworkArr from '../../art.json';
const artworks: Record<string, Artwork> = Object.fromEntries(artworkArr.filter(entry => entry.ImageURL).map(entry => [entry.Title.replace(/\s+/g, '-').toLowerCase(), {
    id: entry.Title.replace(/\s+/g, '-').toLowerCase(),
    title: entry.Title,
    slug: entry.Title.replace(/\s+/g, '-').toLowerCase(),
    artist: entry.Artist[0],
    date: entry.Date,
    medium: entry.Medium,
    dimensions: entry.Dimensions,
    category: entry.Classification,
    tagline: entry.CreditLine,
    price: 200000,
    imageUrl: entry.ImageURL,
    images: [
        entry.ImageURL
    ],
    createdAt: 0,
    updatedAt: 0,
    deletedAt: 0,
    collectionIds: [
        entry.Classification
    ]
} as Artwork]))

const collectionDefaults = {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    imageUrl: '/assets/astro-houston-sticker.png',
    description: ''
};
const collectionSet = new Set(artworkArr.filter(entry => entry.ImageURL).map(entry => entry.Classification))
const collections: Record<string, Collection> = {
    all: {
        id: 'all',
        name: 'View all',
        slug: 'all',
        ...collectionDefaults
    }
}
for (const entry of collectionSet) {
    collections[entry] = {
        id: entry,
        name: entry,
        slug: entry,
        ...collectionDefaults
    }
}
// const collections: Record<string, Collection> = {
//     recentlyAdded: {
//         id: 'recentlyAdded',
//         name: 'Recently Added',
//         description: "Recently added artwork.",
//         slug: 'recentlyAdded',
//         imageUrl: '/assets/astro-houston-sticker.png',
//         ...collectionDefaults,
//     },
//     apparel: {
//         id: 'apparel',
//         name: 'Apparel',
//         description: 'Wear your love for Astro on your sleeve.',
//         slug: 'apparel',
//         imageUrl: '/assets/shirts.png',
//         ...collectionDefaults,
//     },
//     stickers: {
//         id: 'stickers',
//         name: 'Stickers',
//         description: 'Load up those laptop lids with Astro pride.',
//         slug: 'stickers',
//         imageUrl: '/assets/astro-sticker-pack.png',
//         ...collectionDefaults,
//     }
// };

function asResult<T>(data: T) {
    return Promise.resolve({
        data,
        error: undefined,
        request: new Request('https://example.com'),
        response: new Response(),
    });
}

function asError<T>(error: T) {
    return Promise.resolve({
        data: undefined,
        error,
        request: new Request('https://example.com'),
        response: new Response(),
    });
}

function getAddress(address: Required<CreateOrderData>['body']['shippingAddress']) {
    return {
        line1: address?.line1 ?? '',
        line2: address?.line2 ?? '',
        city: address?.city ?? '',
        country: address?.country ?? '',
        province: address?.province ?? '',
        postal: address?.postal ?? '',
        phone: address?.phone ?? null,
        company: address?.company ?? null,
        firstName: address?.firstName ?? null,
        lastName: address?.lastName ?? null,
    };
}
