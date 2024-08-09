'use client';

import React from 'react';
import {
	CheckoutItem,
	CheckoutSidebar,
	Container,
	Title,
	WhiteBlock,
} from '@/shared/components/shared';
import { Input, Textarea } from '@/shared/components/ui';
import { PizzaSize, PizzaType } from '@/shared/constants/pizza';
import { useCart } from '@/shared/hooks';
import { getCartItemDetails } from '@/shared/lib';

export default function CheckoutPage() {
	const {
		totalAmount,
		items,
		productNoun,
		removeCartItem,
		onClickCountButton,
	} = useCart();

	return (
		<Container className="mt-10">
			<Title
				text="Оформление заказа"
				className="font-extrabold mb-8 text-4xl"
			/>

			<div className="flex gap-10">
				<div className="flex flex-col gap-10 flex-1 mb-20">
					<WhiteBlock
						title="1. Корзина"
						endAdornment={
							<span className="font-bold">
								{items.length} {productNoun}
							</span>
						}>
						<div className="flex flex-col gap-5">
							{items.map((item) => (
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
									disabled={item.disabled}
									onClickUpdateQuantity={(type) =>
										onClickCountButton(item.id, item.quantity, type)
									}
									onClickRemove={() => removeCartItem(item.id)}
								/>
							))}
						</div>
					</WhiteBlock>

					<WhiteBlock title="2. Персональные данные">
						<div className="grid grid-cols-2 gap-5">
							<Input
								name="firstName"
								className="text-base"
								placeholder="Имя"
							/>
							<Input
								name="lastName"
								className="text-base"
								placeholder="Фамилия"
							/>
							<Input
								name="email"
								className="text-base"
								placeholder="E-Mail"
							/>
							<Input
								name="phone"
								className="text-base"
								placeholder="Телефон"
							/>
						</div>
					</WhiteBlock>

					<WhiteBlock title="3. Адрес доставки">
						<div className="flex flex-col gap-5">
							<Input
								name="firstName"
								className="text-base"
								placeholder="Адрес доставки"
							/>
							<Textarea
								className="text-base"
								placeholder="Комментарий к заказу"
								rows={5}
							/>
						</div>
					</WhiteBlock>
				</div>

				<div className="w-[450px]">
					<CheckoutSidebar totalAmount={totalAmount} />
				</div>
			</div>
		</Container>
	);
}
