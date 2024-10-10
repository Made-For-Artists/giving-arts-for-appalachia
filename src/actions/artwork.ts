import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { app } from '../firebase/server';

export const artwork = {
    submitArtwork: defineAction({
        accept: 'form',
        input: z.object({
            title: z.string(),
            slug: z.string(),
            artist: z.string(),
            email: z.string().email(),
            phone: z.string(),
            medium: z.string(),
            dimensions: z.string(),
            category: z.string(),
            tagline: z.string(),
            price: z.number(),
            formattedPrice: z.string(),
            imageUrl: z.string(),
            images: z.array(z.string())
        }),
        handler: async (submission) => {
            console.log('form submission:', submission)
            try {
                if (app) {
                    const db = getFirestore();
                    const ref = db.collection('artworks');

                    const docRef = await ref.add({
                        ...submission,
                        createdAt: Timestamp.now(),
                        purchased: false
                    })
                    console.log('saved doc:', docRef.id)
                    return { documentId: docRef.id };
                }
            } catch (err) {
                console.log('unable to save to db:', err)
                throw new ActionError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Unable to save submission to db.",
                });
            }
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "User must be logged in.",
            });
        },
    })
}