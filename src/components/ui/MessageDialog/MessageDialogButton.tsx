
import { MessageDialogStore } from '~/features/cart/store.ts';
import { Button } from '../Button.tsx';
import { MessageDialog } from './MessageDialog.tsx';

export interface Props {
    artworkID?: string;
}

export function MessageDialogButton(props: Props) {
	return (
		<MessageDialog
            artworkID={props.artworkID}
			open={MessageDialogStore.messageDialogOpen}
			onOpenChange={MessageDialogStore.setMessageDialogOpen}
			trigger={<Button>send message</Button>}
		></MessageDialog>
	);
}
