import { NavigationMenu } from "@kobalte/core/navigation-menu";
import "./NavBar.css";

interface Props {
	orientation: "horizontal" | "vertical";
}

export function NavBar(props : Props) {
	return (
		<>
			<NavigationMenu class="navigation-menu__root" orientation={props.orientation}>
				<NavigationMenu.Trigger
					class="navigation-menu__trigger"
					as="a"
					href="/how-it-works"
				>
					How it works
				</NavigationMenu.Trigger>
				<NavigationMenu.Trigger
					class="navigation-menu__trigger"
					as="a"
					href="/collections/all"
				>
					Gallery
				</NavigationMenu.Trigger>
				<NavigationMenu.Trigger
					class="navigation-menu__trigger"
					as="a"
					href="/donate"
				>
					Donate your art
				</NavigationMenu.Trigger>

				<NavigationMenu.Viewport class="navigation-menu__viewport">
					<NavigationMenu.Arrow class="navigation-menu__arrow" />
				</NavigationMenu.Viewport>
			</NavigationMenu>
		</>
	);
}
