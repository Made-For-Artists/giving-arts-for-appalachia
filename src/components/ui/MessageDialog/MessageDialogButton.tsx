
import { MessageDialogStore } from '~/features/cart/store.ts';
import type { Artwork } from '~/lib/client.types.ts';
import { Button } from '../Button.tsx';
import { MessageDialog } from './MessageDialog.tsx';

export interface Props {
    artworkID?: string;
    artwork?: Artwork;
    disabled?: boolean;
}

export function MessageDialogButton(props: Props) {
	return (
		<MessageDialog
            artwork={props.artwork}
            artworkID={props.artworkID}
			open={MessageDialogStore.messageDialogOpen}
			onOpenChange={MessageDialogStore.setMessageDialogOpen}
			trigger={<Button disabled={props.disabled}>send message</Button>}
		></MessageDialog>
	);
}
