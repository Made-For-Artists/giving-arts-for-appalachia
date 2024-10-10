// This file contains mock functions for all storefront services.
// You can use this as a template to connect your own ecommerce provider.

import type { Options, RequestResult } from '@hey-api/client-fetch';
import type {
    Collection,
    CreateCustomerData,
    CreateCustomerError,
    CreateCustomerResponse,
    CreateOrderData,
    CreateOrderError,
    CreateOrderResponse,
    GetArtworkByIdResponse,
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
    Order
} from './client.types.ts';

export * from './client.types.ts';

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

const collectionDefaults = {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    description: ''
};
const collections: Record<string, Collection> = {
    all: {
        id: 'all',
        name: 'View all',
        slug: 'all',
        imageUrl: '/assets/paintings-category.jpeg',
        ...collectionDefaults
    },
    paintings: {
        id: 'paintings',
        name: 'Paintings',
        slug: 'paintings',
        imageUrl: '/assets/paintings-category.jpeg',
        ...collectionDefaults
    },
    sculptures: {
        id: 'sculptures',
        name: 'Sculptures',
        slug: 'sculptures',
        imageUrl: '/assets/sculptures-category.jpeg',
        ...collectionDefaults
    }
}

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
