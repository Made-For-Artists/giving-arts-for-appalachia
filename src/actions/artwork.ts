import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { LoopsClient } from 'loops';
import { app } from '../firebase/server';

const loops = new LoopsClient(import.meta.env.LOOPS_API)

export const artwork = {
    sendMessage: defineAction({
        accept: 'form',
        input: z.object({
            name: z.string(),
            email: z.string(),
            phone: z.string(),
            message: z.string(),
            artworkID: z.string(),
            title: z.string(),
            price: z.string(),
            artist: z.string(),
            artistEmail: z.string()
        }),
        handler: async (submission) => {
            console.log('new user message:', submission)
            if (app) {
                try {
                    const db = getFirestore();
                    const ref = db.collection('pendingMessages');

                    const docRef = await ref.add({
                        ...submission,
                        createdAt: Timestamp.now(),
                        openedAt: 0
                    })
                    console.log('saved user message:', docRef.id)

                    // Send user confirmation email
                    const payload = {
                        eventName: 'artwork_inquiry',
                        email: submission.email,
                        firstName: submission.name,
                        eventProperties: {
                            title: submission.title,
                            artist: submission.artist,
                            price: submission.price,
                            artworkLink: `https://givingarts.mfa.studio/artworks/${submission.artworkID}`
                        }
                    }
                    const loopsResponse = await loops.sendEvent(payload);
                    if (!loopsResponse?.success) throw new ActionError({ code: 'BAD_REQUEST', message: 'Unable to send user confirmation email.' })

                    // Send artist communication email
                    const artistCommPayload = {
                        eventName: 'initiate_artist_comm',
                        email: submission.artistEmail,
                        firstName: submission.artist,
                        eventProperties: {
                            customerName: submission.name,
                            customerEmail: submission.email,
                            customerPhone: submission.phone,
                            customerMessage: submission.message,
                        }
                    }
                    const artistCommResponse = await loops.sendEvent(artistCommPayload);
                    if (!artistCommResponse?.success) throw new ActionError({ code: 'BAD_REQUEST', message: 'Unable to send artist communication email.' })

                    return { documentId: docRef.id };
                } catch (err) {
                    console.log('unable to save to db:', err)
                    throw new ActionError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Unable to save user message to db.",
                    });
                }
            }

            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "Unable to init firebase app.",
            });
        }
    }),
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