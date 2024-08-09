import React, { useCallback } from 'react';

import { getNoun } from '@/shared/lib';
import { useCartStore } from '@/shared/store';
import { CreateCartItemValues } from '@/shared/services/dto/cart.dto';
import { CartStateItem } from '@/shared/lib/get-cart-details';
import { updateItemQuantity } from '@/shared/services/cart';

type ReturnProps = {
	totalAmount: number;
	items: CartStateItem[];
	loading: boolean;
	productNoun: string;
	updateItemQuantity: (id: number, quantity: number) => void;
	removeCartItem: (id: number) => void;
	addCartItem: (values: CreateCartItemValues) => void;
	onClickCountButton: (
		id: number,
		quantity: number,
		type: 'plus' | 'minus'
	) => void;
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
