import { NavBar } from '~/components/layout/NavBar.tsx';
import { Drawer } from '~/components/ui/Drawer.tsx';
import { CartButton } from './CartButton.tsx';
import { CartStore } from './store.ts';

export function CartDrawer() {
	return (
		<Drawer
			title="Navigation drawer"
			open={CartStore.drawerOpen}
			onOpenChange={CartStore.setDrawerOpen}
			trigger={<CartButton as="div" />}
		>
			<div class="flex h-full flex-col py-4">
				<aside class="mt-3 mx-auto">
					<NavBar orientation='vertical'/>
				</aside>
			</div>
		</Drawer>
	);
}
