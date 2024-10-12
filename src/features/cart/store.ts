import { createSignal } from 'solid-js';

export const CartStore = (function createCartStore() {
    const [drawerOpen, setDrawerOpen] = createSignal(false);

    return {
        get drawerOpen() {
            return drawerOpen();
        },
        setDrawerOpen(open: boolean) {
            setDrawerOpen(open);
        },
        openDrawer() {
            setDrawerOpen(true);
        },
        closeDrawer() {
            setDrawerOpen(false);
        },
        toggleDrawer() {
            setDrawerOpen((open) => !open);
        },
    };
})();

export const MessageDialogStore = (function createMessageDialogStore() {
    const [messageDialogOpen, setMessageDialogOpen] = createSignal(false);

    return {
        get messageDialogOpen() {
            return messageDialogOpen();
        },
        setMessageDialogOpen(open: boolean) {
            setMessageDialogOpen(open);
        },
        openMessageDialog() {
            setMessageDialogOpen(true);
        },
        closeMessageDialog() {
            setMessageDialogOpen(false);
        },
        toggleMessageDialog() {
            setMessageDialogOpen((open) => !open);
        },
    };
})();
