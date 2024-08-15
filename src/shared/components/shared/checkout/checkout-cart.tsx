import {
	CheckoutItem,
	CheckoutItemSkeleton,
	WhiteBlock,
} from '@/shared/components/shared';
import { PizzaSize, PizzaType } from '@/shared/constants/pizza';
import { OnClickCountButtonType } from '@/shared/hooks/use-cart';
import { getCartItemDetails } from '@/shared/lib';
import { CartStateItem } from '@/shared/lib/get-cart-details';
import React from 'react';

interface Props {
	items: CartStateItem[];
	productNoun: string;
	onClickCountButton: OnClickCountButtonType;
	removeCartItem: (id: number) => void;
	loading?: boolean;
	disabledItemId: number | null;
	className?: string;
}

export const CheckoutCart: React.FC<Props> = ({
	items,
	productNoun,
	onClickCountButton,
	removeCartItem,
	loading,
	disabledItemId,
	className,
}) => {
	return (
		<WhiteBlock
			title="1. Корзина"
			endAdornment={
				<span className="font-bold">
					{items.length} {productNoun}
				</span>
			}
			className={className}>
			<div className="flex flex-col gap-5">
				{loading &&
					[...Array(4)].map((_, idx) => <CheckoutItemSkeleton key={idx} />)}

				{!loading &&
					items.length > 0 &&
					items.map((item) => (
						<CheckoutItem
							key={item.id}
							id={item.id}
							imageUrl={item.imageUrl}
							details={getCartItemDetails(
								item.ingredients,
								item.pizzaType as PizzaType,
								item.pizzaSize as PizzaSize
							)}
							name={item.name}
							price={item.price}
							quantity={item.quantity}
							disabled={item.disabled || disabledItemId === item.id}
							onClickUpdateQuantity={(type: 'plus' | 'minus') =>
								onClickCountButton(item.id, item.quantity, type)
							}
							onClickRemove={() => removeCartItem(item.id)}
						/>
					))}
			</div>
		</WhiteBlock>
	);
};
