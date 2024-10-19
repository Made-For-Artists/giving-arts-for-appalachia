import { Dialog } from '@kobalte/core/dialog';
import { RiSystemCloseFill } from 'solid-icons/ri';
import type { JSX } from 'solid-js/types/jsx.d.ts';
import './MessageDialog.css';
import { actions } from 'astro:actions';
import { Toast, toaster } from "@kobalte/core/toast";
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import type { Artwork } from '~/lib/client.types.ts';
import { Button } from '../Button.tsx';
import { Textfield } from '../Textfield/Textfield.tsx';

export function MessageDialog(props: {
	artworkID?: string;
    artwork?: Artwork;
    trigger?: JSX.Element;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange: (open: boolean) => void;
}) {
    const [pending, setPending] = createSignal<boolean>(false)

    let id: number;
    const showToast = (title: string) => {
        id = toaster.show(props => (
            <Toast toastId={props.toastId} class="toast">
                <div class="toast__content">
                    <div>
                        <Toast.Title class="toast__title">{title}</Toast.Title>
                        {/* <Toast.Description class="toast__description">
                        Monday, January 3rd at 6:00pm
                        </Toast.Description> */}
                    </div>
                    <Toast.CloseButton class="toast__close-button">
                        <RiSystemCloseFill />
                    </Toast.CloseButton>
                </div>
                <Toast.ProgressTrack class="toast__progress-track">
                    <Toast.ProgressFill class="toast__progress-fill" />
                </Toast.ProgressTrack>
            </Toast>
        ));
    };
    
	return (
        <>
            <Dialog
                defaultOpen={props.defaultOpen}
                open={props.open}
                onOpenChange={props.onOpenChange}
                preventScroll={true}
            >
                <Dialog.Trigger class="dialog__trigger">{props.trigger}</Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay class="dialog__overlay" />
                    <div class="dialog__positioner">
                        <Dialog.Content class="dialog__content prose prose-gafacolors">
                            <div class="dialog__header">
                                <Dialog.Title class="dialog__title m-0">Send message</Dialog.Title>
                                <Dialog.CloseButton class="dialog__close-button">
                                    <RiSystemCloseFill size={24} />
                                </Dialog.CloseButton>
                            </div>
                            <Dialog.Description class="dialog__description">
                                To get in contact with the artist, please fill out the following form. The artist will get back to you as soon as possible.
                            </Dialog.Description>
                            <form id="messageForm" class="grid gap-4">
                                <Textfield required name="name" label="Name"></Textfield>
                                <Textfield required name="email" label="Email" type="email"></Textfield>
                                <Textfield required name="phone" label="Phone" type="tel"></Textfield>
                                <Textfield required name="message" label="Message" textarea></Textfield>
                                <input required type="hidden" value={props.artworkID} name="artworkID" />
                                <Button pending={pending()} onclick={async (event) => {
                                    event.preventDefault();
                                    setPending(true)
                                    
                                    const form = document.querySelector('form')
                                    if (form?.reportValidity() && props.artwork) {
                                        const formData = new FormData(form);
                                        formData.set('title', props.artwork.title)
                                        formData.set('artist', props.artwork.artist)
                                        formData.set('price', props.artwork.formattedPrice)
                                        formData.set('artistEmail', props.artwork.email)
                            
                                        const { data, error } = await actions.artwork.sendMessage(formData);
                                        if (!error) {
                                            showToast('Message has been sent!')
                                            props.onOpenChange(false)
                                        }
                                        if (error) {
                                            showToast('Unable to send message, please refresh page and try again.');
                                        };
                                    }
                                    setPending(false)
                                }}>send message</Button>
                            </form>
                        </Dialog.Content>
                    </div>
                </Dialog.Portal>
            </Dialog>

            <Portal>
                <Toast.Region>
                <Toast.List class="toast__list" />
                </Toast.Region>
            </Portal>
        </>
	);
}
