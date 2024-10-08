import { twMerge } from 'tailwind-merge';
import { formatProductPrice } from '~/lib/currency.ts';
import type { Product } from '../cart/cart.ts';

type Props = {
	price: Product['price'];
	class?: string;
};

export function ProductPrice(props: Props) {
	return (
		<span class={twMerge('flex gap-2 font-medium', props.class)}>
			{formatProductPrice(props.price)}
		</span>
	);
}
