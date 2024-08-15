import React from 'react';

import { getNoun } from '@/shared/lib';
import { useCartStore } from '@/shared/store';
import { CreateCartItemValues } from '@/shared/services/dto/cart.dto';
import { CartStateItem } from '@/shared/lib/get-cart-details';

export type OnClickCountButtonType = (
	id: number,
	quantity: number,
	type: 'plus' | 'minus'
) => void;

type ReturnProps = {
	totalAmount: number;
	items: CartStateItem[];
	productNoun: string;
	loading: boolean;
	updatingItemId: number | null;
	updateItemQuantity: (id: number, quantity: number) => void;
	removeCartItem: (id: number) => void;
	addCartItem: (values: CreateCartItemValues) => void;
	onClickCountButton: OnClickCountButtonType;
};

export const useCart = (): ReturnProps => {
	const cartState = useCartStore((state) => ({
		...state,
		productNoun: getNoun(state.items.length, 'товар', 'товара', 'товаров'),
	}));

	React.useEffect(() => {
		cartState.fetchCartItems();
	}, []);

	const onClickCountButton = React.useCallback(
		(id: number, quantity: number, type: 'plus' | 'minus') => {
			const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
			cartState.updateItemQuantity(id, newQuantity);
		},
		[cartState]
	);

	return {
		...cartState,
		onClickCountButton,
	};
};
