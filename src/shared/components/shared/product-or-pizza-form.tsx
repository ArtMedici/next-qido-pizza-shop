'use client';

import { ProductExtends } from '@/@types/prisma';
import { PizzaForm, ProductForm } from '@/shared/components/shared';
import { useCartStore } from '@/shared/store';
import React from 'react';
import toast from 'react-hot-toast';

interface Props {
	product: ProductExtends;
	onSubmit?: VoidFunction;
	className?: string;
}

export const ProductOrPizzaForm: React.FC<Props> = ({
	product,
	onSubmit: _onSubmit,
	className,
}) => {
	const [addCartItem, loading] = useCartStore((state) => [
		state.addCartItem,
		state.loading,
	]);

	const firstItem = product.items[0];
	const isPizzaForm = Boolean(firstItem.pizzaType);

	const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
		try {
			const itemId = productItemId ?? firstItem.id;

			await addCartItem({
				productItemId: itemId,
				ingredients,
			});
			toast.success(
				`${isPizzaForm ? 'Пицца добавлена' : 'Продукт добавлен'}  в корзину`
			);

			_onSubmit?.();
		} catch (error) {
			toast.error(
				`Не удалось добавить ${isPizzaForm ? 'пиццу' : 'продукт'} в корзину`
			);
			console.log('Exception ' + error);
		}
	};

	if (isPizzaForm) {
		return (
			<PizzaForm
				imageUrl={product.imageUrl}
				name={product.name}
				ingredients={product.ingredients}
				items={product.items}
				onSubmit={onSubmit}
				loading={loading}
				className={className}
			/>
		);
	}

	return (
		<ProductForm
			imageUrl={product.imageUrl}
			name={product.name}
			onSubmit={onSubmit}
			price={firstItem.price}
			loading={loading}
			className={className}
		/>
	);
};
