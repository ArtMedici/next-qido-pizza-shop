'use client';

import React from 'react';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/shared/components/ui/sheet';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { CartItemDrawer } from '@/shared/components/shared/cart-item-drawer';
import { getCartItemDetails, getNoun } from '@/shared/lib';
import { useCartStore } from '@/shared/store';
import { PizzaSize, PizzaType } from '@/shared/constants/pizza';

interface Props {
	className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [
		totalAmount,
		items,
		fetchCartItems,
		updateItemQuantity,
		removeCartItem,
	] = useCartStore((state) => [
		state.totalAmount,
		state.items,
		state.fetchCartItems,
		state.updateItemQuantity,
		state.removeCartItem,
	]);

	const productNoun = getNoun(items.length, 'товар', 'товара', 'товаров');

	React.useEffect(() => {
		fetchCartItems();
	}, []);

	const onClickCountButton = (
		id: number,
		quantity: number,
		type: 'plus' | 'minus'
	) => {
		const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
		updateItemQuantity(id, newQuantity);
	};

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent className="flex flex-col justify-between pb-0 bg-[#F4F1EE]">
				<SheetHeader>
					<SheetTitle>
						В корзине{' '}
						<span className="font-bold">
							{items.length} {productNoun}
						</span>
					</SheetTitle>
				</SheetHeader>

				<div className="-mx-6 mt-5 overflow-auto flex-1">
					{items.map((item) => (
						<div
							className="mb-2"
							key={item.id}>
							<CartItemDrawer
								id={item.id}
								imageUrl={item.imageUrl}
								details={
									item.pizzaSize && item.pizzaType
										? getCartItemDetails(
												item.pizzaType as PizzaType,
												item.pizzaSize as PizzaSize,
												item.ingredients
											)
										: ''
								}
								name={item.name}
								price={item.price}
								quantity={item.quantity}
								onClickUpdateQuantity={(type) =>
									onClickCountButton(item.id, item.quantity, type)
								}
								onClickRemove={() => removeCartItem(item.id)}
							/>
						</div>
					))}
				</div>

				<SheetFooter className="-mx-6 bg-white p-8">
					<div className="w-full">
						<div className="flex mb-4">
							<span className="flex flex-1 text-lg text-neutral-500">
								Итого
								<div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
							</span>

							<span className="font-bold text-lg">{totalAmount} ₽</span>
						</div>

						<Link href="/cart">
							<Button
								type="submit"
								className="w-full h-12 text-base">
								Оформить заказ
								<ArrowRight className="w-5 ml-2" />
							</Button>
						</Link>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
