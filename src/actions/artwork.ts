import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const artwork = {
    submitArtwork: defineAction({
        accept: 'form',
        input: z.object({
            email: z.string().email(),
            terms: z.boolean(),
        }),
        handler: async ({ email, terms }) => {
            console.log('form submission:', email, terms)
        },
    })
}